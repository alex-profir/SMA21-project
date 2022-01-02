import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, TextInput, View, Text } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { SocketContext } from "../../contexts/SocketIoContext";
import { FullUser } from "../../models/User";
import { Root } from "../../routes";
import { endpointURL } from "../../services/config";
import { px } from "../../styles";



type MessageType = {
    name: string,
    message: string,
    position: "left" | "right",
    avatar: string
    userId: string
}


type Message = {
    text: string;
    user: FullUser;
    room: string;
}

export const PersonView = (p: NativeStackScreenProps<Root, "PersonView">) => {
    const { user, room: roomId, } = p.route.params;
    const { navigation } = p;

    const [messageList, setMessageList] = useState<Message[]>([]);
    const socket = useContext(SocketContext);

    useEffect(() => {
        navigation.setOptions({
            title: `Chat with ${user.first_name} ${user.last_name}`
        })
    }, [user]);

    useEffect(() => {
        socket.on("message", (message) => {
            console.log({ message });
            if (message.room === roomId) {
                setMessageList(messageList => [...messageList, message]);
            }
        });
        socket.on("typing", ({ user }) => {
            // setUsersTyping(users => [...users, user])
        })
        socket.on("stop typing", ({ user }) => {
            // setUsersTyping(users => {
            //     return users.filter(u => user._id !== u._id)
            // })
        })

    }, []);

    const renderRow = ({ item }: { item: MessageType }) => {
        return (
            <ListItem
            >
                {item.position === "left" ? <><Avatar onPress={() => {
                    navigation.navigate("Socials", {
                        screen: "ProfileView",
                        params: {
                            userId: item.userId
                        }
                    })
                }} rounded source={{ uri: `${endpointURL}/file/${item?.avatar}` }} /></> : <></>}
                <ListItem.Content style={{
                    alignItems: item.position === "left" ? "flex-start" : "flex-end"
                }}>
                    {/* <ListItem.Title
                        style={{ color: 'white', fontWeight: 'bold' }}
                    >
                        {item.name}
                    </ListItem.Title> */}
                    <ListItem.Content style={{
                        backgroundColor: "gray",
                        padding: 10,
                        borderRadius: 10,
                    }}>
                        <Text>
                            {item.message}
                            {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab quibusdam odit maxime. Labore quo odio, accusantium sint obcaecati quidem iste sit inventore animi tenetur ipsam magni tempora exercitationem ipsa beatae! */}
                        </Text>
                    </ListItem.Content>
                </ListItem.Content>

                {/* {item.position === "right" ? <><Avatar rounded source={{ uri: `${endpointURL}/file/${item?.avatar}` }} /></> : <></>} */}
            </ListItem >
        );
    };


    const flatlistRef = useRef<any>();
    const onPressFunction = () => {
        flatlistRef.current.scrollToEnd({ animating: true });
    };
    const MessageList = useMemo(() => {
        return <FlatList<MessageType>
            style={{
                backgroundColor: "white",
            }}
            ref={flatlistRef}
            // inverted
            data={messageList.map(msg => ({
                avatar: msg.user.avatar!,
                message: msg.text,
                name: msg.user.first_name,
                position: msg.user._id === user._id ? "left" : "right",
                userId: msg.user._id
            }))}
            keyExtractor={(_, index: number) => index.toString()}

            renderItem={renderRow as any}
        />;
    }, [messageList]);
    useEffect(() => {
        onPressFunction();
    }, [messageList]);
    const [textInput, setTextInput] = useState("");
    const onSendMessage = () => {
        socket.emit("message", {
            content: textInput,
            room: roomId
        });
        setTextInput("");
    }
    return <View style={{
        display: "flex",
        flex: 1
    }}>
        {MessageList}
        <View style={{
            padding: px(10),
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <TextInput
                style={{
                    flex: 1,
                    borderRadius: 5,
                    borderWidth: 2,  // size/width of the border
                    borderColor: 'lightgrey',  // color of the border
                    paddingLeft: 10,
                    marginRight: 10,
                    // height: 75
                }}
                value={textInput}
                onChangeText={setTextInput}
                placeholder="Send a message ..."
            />
            <Feather.Button style={{
                padding: px(3),
                // backgroundColor: "none"
            }} onPress={() => {
                if (textInput !== "") {
                    onSendMessage();
                }
            }} name="send" size={24} color="black" />
        </View>
    </View>
}
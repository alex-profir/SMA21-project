import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Platform, View, Text } from "react-native"
import { Avatar, Button, ListItem } from "react-native-elements";
import { Constants } from "react-native-unimodules";
import * as Notifications from 'expo-notifications';
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { searchRoomsInIds } from "../../services/chatRoom.service";
import { endpointURL } from "../../services/config";
import { searchUsersInIds } from "../../services/user.service";
import { useSelector } from "../../store";
import { Subscription } from "expo-modules-core"
import { SocketContext } from "../../contexts/SocketIoContext";
import { Path } from "react-native-svg";
import { Message } from "./PersonView";

export const FriendList = () => {
    const user = useSelector(state => state.userReducer);
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [presentUsers, setPresentUsers] = useState<typeof user[]>([]);
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();
    const [notification, setNotification] = useState<Notifications.Notification>(null!);
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on("message", (message: Message) => {
            schedulePushNotification({
                delay: 0.5,
                author: `${message.user.first_name} ${message.user.last_name}`,
                message: message.text
            })
        });
    }, []);
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log({ response });
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current!);
            Notifications.removeNotificationSubscription(responseListener.current!);
        };
    }, []);

    useEffectAsync(async () => {
        if (user.chatRooms.length > 0) {
            const rooms = await searchRoomsInIds(user.chatRooms);
            setChatRooms(rooms.data);
        } else {
            setChatRooms([]);
        }
        // const users = await searchUsersInIds(user.friends);
        // setFriends(users.data);
    }, [user]);
    useEffectAsync(async () => {
        const members = chatRooms.map(room => room.members).flat();
        const uniqueMembers = [...new Set(members)];
        const users = await searchUsersInIds(uniqueMembers);
        setPresentUsers(users.data);
    }, [chatRooms]);
    const chatList = useMemo(() => {
        return chatRooms.map(room => {
            const currentUser = presentUsers.filter(u => u._id !== user._id).find(el => el.chatRooms.includes(room._id))!;
            return {
                user: currentUser,
                room
            }
        }).filter(el => el.user && el.room)
    }, [presentUsers]);

    const navigation = useNavigation();
    const renderRow = ({ item }: {
        item: {
            user: typeof user,
            room: any
        }
    }) => {
        return (
            <ListItem
                onPress={() => {
                    navigation.navigate("PersonView" as never, {
                        user: item.user,
                        room: item.room._id
                    } as never)
                }}
                style={{
                    backgroundColor: "gray",
                }}
                bottomDivider
            >
                <Avatar rounded source={{ uri: `${endpointURL}/file/${item.user?.avatar}` }} />
                <ListItem.Content>
                    <ListItem.Title
                        style={{ fontWeight: 'bold' }}
                    >
                        {item.user.first_name} {item.user.last_name}
                    </ListItem.Title>
                    <ListItem.Subtitle >
                        Write to me here:)
                    </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="white" tvParallaxProperties />
            </ListItem>
        );
    };

    return <View>
        <FlatList
            data={chatList}
            keyExtractor={(_, index: number) => index.toString()}

            renderItem={renderRow as any}
        />
    </View>
}

async function schedulePushNotification(p: {
    delay: number
    author: string
    message: string
}) {

    await Notifications.scheduleNotificationAsync({
        content: {
            title: `${p.author} sent you a message 🔥`,
            body: p.message,
            attachments: [
                {
                    url: "https://roly-poly-api.herokuapp.com/file/1641062153842-roly-poly-1640650223638-roly-poly-nft-ye-donusturulen-doge-meme-4-milyon-dolara-satildi.jpg",
                }
            ],
        },
        trigger: { seconds: p.delay },
    });
}


async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
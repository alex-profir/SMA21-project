import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react"
import { FlatList, View } from "react-native"
import { Avatar, ListItem } from "react-native-elements";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { searchRoomsInIds } from "../../services/chatRoom.service";
import { endpointURL } from "../../services/config";
import { searchUsersInIds } from "../../services/user.service";
import { useSelector } from "../../store";

export const FriendList = () => {
    const user = useSelector(state => state.userReducer);
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [presentUsers, setPresentUsers] = useState<typeof user[]>([]);
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

    console.log({ chatList });

    // console.log({ chatRooms });
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
                        style={{ color: 'white', fontWeight: 'bold' }}
                    >
                        {item.user.first_name} {item.user.last_name}
                    </ListItem.Title>
                    <ListItem.Subtitle style={[{ color: 'white' }]}>
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
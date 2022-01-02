import { Feather } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { Avatar, } from "react-native-elements";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { endpointURL } from "../../services/config";
import { getRgb } from "../../services/file.service";
import { useDispatch, useSelector } from "../../store";
import { width } from "../../styles";
import * as DocumentPicker from 'expo-document-picker';
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { acceptFriendRequest, getUserById, postProfilePicture, rejectFriendRequest, sendFriendRequest, unfriend } from "../../services/user.service";
import { RenderUserRequest } from "./UserFriendRequest";
import { SafeAreaView } from "react-native-safe-area-context";
import { logoutAction } from "../../store/functions/user.functions";
import { Root } from "../../routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FullUser } from "../../models/User";
import { SocketContext } from "../../contexts/SocketIoContext";
import { Loader } from "../Loading";

const BorderRadius = 40;
export const Profile = (p: NativeStackScreenProps<Root, "ProfileView">) => {
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const { userId } = p.route.params;
    const [user, setUser] = useState<FullUser | null>(null);
    const loggedUser = useSelector(state => state.userReducer);
    const [rgb, setRgb] = useState<{ r: number, g: number, b: number } | null>(null);

    const isFriend = loggedUser.friends.includes(userId) && user?.friends.includes(loggedUser._id);
    const hasRequestFriend = user?.friendRequests.includes(loggedUser._id);
    const hasPendingFriendRequest = loggedUser.friendRequests.includes(user?._id ?? "");

    const isMyProfile = user?._id === loggedUser._id;

    useEffect(() => {
        if (user) {
            p.navigation.setOptions({
                title: `${user?.first_name} ${user?.last_name}'s Profile`
            })
        } else {
            p.navigation.setOptions({
                title: `Loading ... `
            })
        }
    }, [user]);

    const { error } = useEffectAsync(async () => {
        const response = await getUserById(userId);
        setUser(response.data);
    }, [userId]);
    const fetchUser = useCallback(async () => {
        const response = await getUserById(userId);
        setUser(response.data);
    }, [userId]);

    useEffect(() => {
        const payload = {
            id: userId
        }
        socket.emit("join room", payload)
        socket.on(userId, () => {
            fetchUser();
        });
        return () => {
            socket.emit("leave room", payload);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
    useEffectAsync(async () => {
        try {
            const request = await getRgb(`${endpointURL}/file/${user?.avatar}`);
            const data = request.data;
            setRgb({
                r: data.Vibrant.rgb[0],
                g: data.Vibrant.rgb[1],
                b: data.Vibrant.rgb[2],
            });

        } catch (e) {
            // console.log("Could not pick color from image");
            // console.log({ e });
            return null;
        }
    }, [user]);

    const sendFriendRequestHandler = async () => {
        await sendFriendRequest(user?._id!);
        fetchUser();
    }

    if (error) {
        return <View>
            <Text>
                User not found
            </Text>
        </View>
    }
    if (!user) {
        return <Loader />
    }
    return <View style={{
        display: "flex",
        flex: 1,
        backgroundColor: "white"
    }}>
        <View style={{
            height: 150,
            backgroundColor: rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},1)` : "gray",
            width: width,
            borderBottomLeftRadius: BorderRadius,
            borderBottomRightRadius: BorderRadius,
            // marginBottom: 25,
        }} />
        <View style={{
            position: "absolute",
            top: 100,
            left: width / 2 - 50,

            borderRadius: BorderRadius,
            borderColor: "white",
            borderWidth: 5
        }}>
            <Avatar
                size={"large"}
                rounded
                source={{ uri: `${endpointURL}/file/${user.avatar}`, height: 100, width: 100 }}
                onPress={async () => {
                    const doc = await DocumentPicker.getDocumentAsync({
                        // multiple: false,
                        type: "image/*"
                    });
                    if (doc.type === "success") {
                        try {
                           await postProfilePicture({
                                uri: doc.uri,
                                type: doc.mimeType,
                                name: doc.name
                            } as any);
                        } catch (e) {
                        }
                        // dispatch(uploadUserProfilePicture(doc.file as any));
                        // await uploadUserProfilePicture(doc.file as any);
                    } else {
                    }
                }}
            >
                {/* <Avatar.Accessory tvParallaxProperties size={23} /> */}
            </Avatar>

        </View>
        <SafeAreaView style={{
            alignItems: "center"
        }}>
            <Text h2 style={{
                marginBottom: 50
            }}>
                {user.first_name} {user.last_name}
            </Text>
            {!isMyProfile && <View>
                {!isFriend && <View>
                    {hasRequestFriend ? <View>
                        <Text>
                            You sent a request to {user.first_name}, wait for him to respond :)
                        </Text>
                    </View> : hasPendingFriendRequest ? <View>
                        <Text>
                            {user.first_name} {user.last_name} has sent you a friend request
                        </Text>
                        <View style={{
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            <Button title="Accept" onPress={async () => {
                                await acceptFriendRequest(userId);
                                fetchUser();
                            }} />
                            <View style={{ flex: 1 }} />
                            <Button title="Decline" onPress={async () => {
                                await rejectFriendRequest(userId);
                            }} />
                        </View>
                    </View> : <View>
                        <Text>
                            You are not friend with {user.first_name}
                        </Text>
                        <Button title="Send a friend request" onPress={sendFriendRequestHandler} />
                    </View>}
                </View>}
                {isFriend && <View>
                    <Text>
                        {user.first_name} {user.last_name} is your friend :)
                    </Text>
                    <Button title="Unfriend" onPress={() => {
                        unfriend(userId);
                    }} />
                </View>}
            </View>
            }
            {isMyProfile && <View>
                <Text h3>
                    This is your profile
                </Text>
                <Button title={"Logout"} onPress={() => {
                    dispatch(logoutAction())
                }} />
            </View>}
            {/* <Button title="Upload Profile Picture" onPress={() => { }} /> */}
        </SafeAreaView >

    </View >
}
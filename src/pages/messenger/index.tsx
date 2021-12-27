import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, FlatList } from "react-native";
import {
    Text,
    ListItem,
    Avatar,
    Icon,
    Badge,
    ListItemProps,
    Button,
    Switch,
    colors
} from 'react-native-elements';
import { Stack } from "../../routes/Routes";

type List2Data = {
    name: string;
    avatar_url: string;
    subtitle: string;
    linearGradientColors: string[];
};
const list2: Partial<List2Data>[] = [
    {
        name: 'Amy Farha',
        avatar_url: 'https://uifaces.co/our-content/donated/XdLjsJX_.jpg',
        subtitle: 'Vice President',
        linearGradientColors: ['#FF9800', '#F44336'],
    },
    {
        name: 'Chris Jackson',
        avatar_url: 'https://uifaces.co/our-content/donated/KtCFjlD4.jpg',
        subtitle: 'Vice Chairman',
        linearGradientColors: ['#3F51B5', '#2196F3'],
    },
    {
        name: 'Amanda Martin',
        avatar_url:
            'https://images.unsplash.com/photo-1498529605908-f357a9af7bf5?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=047fade70e80ebb22ac8f09c04872c40',
        subtitle: 'CEO',
        linearGradientColors: ['#FFD600', '#FF9800'],
    },
    {
        name: 'Christy Thomas',
        avatar_url: 'https://randomuser.me/api/portraits/women/48.jpg',
        subtitle: 'Lead Developer',
        linearGradientColors: ['#4CAF50', '#8BC34A'],
    },
    {
        name: 'Melissa Jones',
        avatar_url:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTQwMDQ0NDk1OV5BMl5BanBnXkFtZTcwNDcxOTExNg@@._V1_UY256_CR2,0,172,256_AL_.jpg',
        subtitle: 'CTO',
        linearGradientColors: ['#F44336', '#E91E63'],
    },
];
type Root = {
    PersonView: List2Data
}
function PersonView(p: NativeStackScreenProps<Root, "PersonView">) {
    const user = p.route.params;

    console.log({ p });
    return <View>

        <Avatar rounded source={{ uri: user.avatar_url }} />
        <Text>
            {user.name}
        </Text>
    </View>
}

function PersonList() {

    const navigation = useNavigation();
    const renderRow = ({ item }: { item: List2Data }) => {
        return (
            <ListItem
                onPress={() => {
                    navigation.navigate("PersonView" as never, item as never)
                }}
                // linearGradientProps={{
                //     colors: item.linearGradientColors,
                //     start: [1, 0],
                //     end: [0.2, 0],
                // }}
                // containerStyle={{
                //     marginHorizontal: 16,
                //     marginVertical: 8,
                //     borderRadius: 8,
                // }}
                bottomDivider
            >
                <Avatar rounded source={{ uri: item.avatar_url }} />
                <ListItem.Content>
                    <ListItem.Title
                        style={{ color: 'white', fontWeight: 'bold' }}
                    >
                        {item.name}
                    </ListItem.Title>
                    <ListItem.Subtitle style={[{ color: 'white' }]}>
                        {item.subtitle}
                    </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron color="white" tvParallaxProperties />
            </ListItem>
        );
    };
    return <FlatList
        data={[...list2, ...list2, ...list2]}
        keyExtractor={(_, index: number) => index.toString()}

        renderItem={renderRow as any}
    />;
}

export const Messenger = () => {
    return <View style={{
        display: "flex",
        flex: 1,
    }}>
        <Stack.Navigator >
            <Stack.Screen options={{
                // headerShown: false,
                headerTitle: "Friend List",
            }} name="PersonList" component={PersonList} />
            <Stack.Screen options={{
            }} name="PersonView" component={PersonView} />
        </Stack.Navigator>
        {/* <View style={{ paddingVertical: 8 }}>
            {list2.map((l, i) => (
                <ListItem
                    key={i}
                    linearGradientProps={{
                        colors: l.linearGradientColors,
                        start: [1, 0],
                        end: [0.2, 0],
                    }}
                    containerStyle={{
                        marginHorizontal: 16,
                        marginVertical: 8,
                        borderRadius: 8,
                    }}
                >
                    <Avatar rounded source={{ uri: l.avatar_url }} />
                    <ListItem.Content>
                        <ListItem.Title
                            style={{ color: 'white', fontWeight: 'bold' }}
                        >
                            {l.name}
                        </ListItem.Title>
                        <ListItem.Subtitle style={[{ color: 'white' }]}>
                            {l.subtitle}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color="white" tvParallaxProperties />
                </ListItem>
            ))}
        </View> */}
    </View>
}
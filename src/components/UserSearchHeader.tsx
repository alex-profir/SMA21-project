import React, { useContext, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { SearchBoxContext } from "../contexts/SearchBoxContext";
import { px, width } from "../styles";


export const UserSearchHeader = () => {
    const [textInput, setTextInput] = useContext(SearchBoxContext);

    const [search, setSearch] = useState("");
    const timeout = useRef<NodeJS.Timeout>(null!);
    return <View style={{
        width: width - px(100),
        display: "flex"
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
            value={timeout.current ? search : textInput}
            onChangeText={(text) => {
                if (timeout.current) {
                    clearTimeout(timeout.current);
                }
                setSearch(text);
                timeout.current = setTimeout(() => {
                    setTextInput(text);
                    timeout.current = null!;
                }, 500);
            }}
            placeholder="Search users ... "
        />
    </View>
}
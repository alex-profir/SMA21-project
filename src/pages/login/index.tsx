import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import KeyboardAvoidingComponent from '../../components/KeyboardAvoidingComponent';
import LoginScreen3 from './screen3';


const Login = (p: NativeStackScreenProps<any, any>) => {
    return (
        <View style={styles.container}>
            <KeyboardAvoidingComponent>
                <LoginScreen3  {...p} />
            </KeyboardAvoidingComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
});

export default Login;
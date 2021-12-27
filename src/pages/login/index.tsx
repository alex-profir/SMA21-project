import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../../components/Header';
import KeyboardAvoidingComponent from '../../components/KeyboardAvoidingComponent';
import LoginScreen3 from './screen3';


const Login = () => {
    return (
        <View style={styles.container}>
            <KeyboardAvoidingComponent>
                <LoginScreen3 />
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
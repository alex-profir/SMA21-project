import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Constants from 'expo-constants';
import { login } from './src/services/auth.service';
import Login from './src/pages/login';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux"
import { store } from './src/store';
import Routes from './src/routes/Routes';
import { SocketIoContextProvider } from './src/contexts/SocketIoContext';
import { SearchBoxContextProvider } from './src/contexts/SearchBoxContext';

export default function App() {
  return (
    <View style={styles.container}>
      <Provider store={store}>
        <SocketIoContextProvider>
          <SearchBoxContextProvider>
            <NavigationContainer>
              <Routes />
            </NavigationContainer>
          </SearchBoxContextProvider>
        </SocketIoContextProvider>
        {/* <Login /> */}
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    // backgroundColor: 'blue',
  },
});

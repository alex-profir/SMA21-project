import React, { useState, useRef } from 'react';
import {
    Alert,
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
    UIManager,
    TextInput,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { useDispatch } from '../../store';

import { login as loginApiCall, register, } from "../../services/auth.service";
import { isAxiosError, storeToken } from '../../utils/utilFunctions';
import { ServerError } from '../../models/ServerError';
import { useNavigation } from '../../routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../../../assets/images/bg_screen2.jpg');

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

type TabSelectorProps = {
    selected: boolean;
};

const TabSelector: React.FunctionComponent<TabSelectorProps> = ({
    selected,
}) => {
    return (
        <View style={styles.selectorContainer}>
            <View style={selected && styles.selected} />
        </View>
    );
};

const LoginScreen3 = (p: NativeStackScreenProps<any, any>) => {
    const { navigation: nav } = p;
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('alex_profir@yahoo.com');
    const [isEmailValid, setEmailValid] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('12345678');
    const [isPasswordValid, setPasswordValid] = useState<boolean>(true);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isConfirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(
        true
    );
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const emailInput = useRef<TextInput>(null);
    const passwordInput = useRef<TextInput>(null);
    const confirmationInput = useRef<TextInput>(null);

    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;

    const selectCategory = (selectedCategoryIndex: number) => {
        LayoutAnimation.easeInEaseOut();
        setLoading(false);
        setSelectedCategory(selectedCategoryIndex);
    };

    const validateEmail = (testEmail: string) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(testEmail);
    };

    const login = async () => {
        setLoading(true);
        // Simulate an API call
        const isEmailValidFlag =
            validateEmail(email);
        const isPasswordValidFlag =
            password.length >= 8;

        LayoutAnimation.easeInEaseOut();
        setLoading(false);
        setEmailValid(isEmailValidFlag);
        setPasswordValid(isPasswordValidFlag);
        if (isEmailValidFlag && isPasswordValidFlag) {
            try {
                const req = await loginApiCall({
                    email,
                    password
                });
                const { user, token } = req.data;
                dispatch({
                    type: "SET_USER",
                    user: user
                });
                await storeToken(token);
                Alert.alert('🔥', 'Successfully Logged In');
                nav.navigate("dashboard");
                // routeTo(urls.dashboard);
            } catch (error) {
                if (isAxiosError(error)) {
                    const message = error.response!.data.message;
                    Alert.alert(message as string);
                    console.log({ message });
                    // setErrors({ submit: message } as any);
                }
            }
        }
        // setTimeout(() => {
        // }, 1500);
    };

    const signUp = async () => {
        setLoading(true);
        // Simulate an API call
        setTimeout(() => {
            const isEmailValidFlag =
                validateEmail(email);
            const isPasswordValidFlag =
                password.length >= 8;
            const isConfirmPasswordValidFlag =
                password === confirmPassword;

            LayoutAnimation.easeInEaseOut();
            setLoading(false);
            setEmailValid(validateEmail(email));
            setPasswordValid(password.length >= 8);
            setConfirmPasswordValid(
                password === confirmPassword
            );
            if (
                isEmailValidFlag &&
                isPasswordValidFlag &&
                isConfirmPasswordValidFlag
            ) {
                try {
                    // TODO figure out register
                    // await register({
                    //     chatRooms: [],
                    //     friends: [],
                    //     friendRequests: []
                    //     email,
                    //     password,

                    // });
                    // setSubmited(true);
                } catch (error) {
                    if (isAxiosError<ServerError>(error)) {
                        const message = error.response!.data.message;
                        Alert.alert(message as string);
                    }
                }
            }
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
                <View>
                    <View style={styles.titleContainer}>
                        <View>
                            <Text style={styles.titleText}>Roly Poly</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            disabled={isLoading}
                            type="clear"
                            activeOpacity={0.7}
                            onPress={() => selectCategory(0)}
                            containerStyle={{ flex: 1 }}
                            titleStyle={[
                                styles.categoryText,
                                isLoginPage && styles.selectedCategoryText,
                            ]}
                            title="Login"
                        />
                        <Button
                            disabled={isLoading}
                            type="clear"
                            activeOpacity={0.7}
                            onPress={() => selectCategory(1)}
                            containerStyle={{ flex: 1 }}
                            titleStyle={[
                                styles.categoryText,
                                isSignUpPage && styles.selectedCategoryText,
                            ]}
                            title="Sign up"
                        />
                    </View>
                    <View style={styles.rowSelector}>
                        <TabSelector selected={isLoginPage} />
                        <TabSelector selected={isSignUpPage} />
                    </View>
                    <View style={styles.formContainer}>
                        <Input
                            leftIcon={
                                <Icon
                                    tvParallaxProperties
                                    name="envelope-o"
                                    type="font-awesome"
                                    color="rgba(0, 0, 0, 0.38)"
                                    size={25}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            }
                            value={email}
                            keyboardAppearance="light"
                            autoFocus={false}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            returnKeyType="next"
                            inputStyle={{ marginLeft: 10, color: 'grey' }}
                            placeholder={'Email'}
                            containerStyle={{
                                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                            }}
                            ref={emailInput}
                            // onSubmitEditing={() => passwordInput.current.focus()}
                            onChangeText={(text) => setEmail(text)}
                            errorMessage={
                                isEmailValid ? '' : 'Please enter a valid email address'
                            }
                        />
                        <Input
                            leftIcon={
                                <Icon
                                    tvParallaxProperties
                                    name="lock"
                                    type="simple-line-icon"
                                    color="rgba(0, 0, 0, 0.38)"
                                    size={25}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            }
                            value={password}
                            keyboardAppearance="light"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                            returnKeyType={isSignUpPage ? 'next' : 'done'}
                            blurOnSubmit={true}
                            containerStyle={{
                                marginTop: 16,
                                borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                            }}
                            inputStyle={{ marginLeft: 10, color: 'grey' }}
                            placeholder={'Password'}
                            ref={passwordInput}
                            onSubmitEditing={() => {
                                // isSignUpPage ? confirmationInput.current.focus() : login();
                            }}
                            onChangeText={(text) => setPassword(text)}
                            errorMessage={
                                isPasswordValid ? '' : 'Please enter at least 8 characters'
                            }
                        />
                        {isSignUpPage && (
                            <Input
                                leftIcon={
                                    <Icon
                                        tvParallaxProperties
                                        name="lock"
                                        type="simple-line-icon"
                                        color="rgba(0, 0, 0, 0.38)"
                                        size={25}
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                }
                                value={confirmPassword}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType={'done'}
                                blurOnSubmit={true}
                                containerStyle={{
                                    marginTop: 16,
                                    borderBottomColor: 'rgba(0, 0, 0, 0.38)',
                                }}
                                inputStyle={{ marginLeft: 10, color: 'grey' }}
                                placeholder={'Confirm password'}
                                ref={confirmationInput}
                                onSubmitEditing={signUp}
                                onChangeText={(text) => setConfirmPassword(text)}
                                errorMessage={
                                    isConfirmPasswordValid ? '' : 'Please enter the same password'
                                }
                            />
                        )}
                        <Button
                            buttonStyle={styles.loginButton}
                            containerStyle={{ marginTop: 32, flex: 0 }}
                            activeOpacity={0.8}
                            title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                            onPress={isLoginPage ? login : signUp}
                            titleStyle={styles.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 20,
        width: '100%',
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    rowSelector: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorContainer: {
        flex: 1,
        alignItems: 'center',
    },
    selected: {
        position: 'absolute',
        borderRadius: 50,
        height: 0,
        width: 0,
        top: -5,
        borderRightWidth: 70,
        borderBottomWidth: 70,
        borderColor: 'white',
        backgroundColor: 'white',
    },
    loginTextButton: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#7baf99',
        borderRadius: 10,
        height: 50,
        width: 200,
    },
    titleContainer: {
        height: 150,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH - 30,
        borderRadius: 10,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    bgImage: {
        flex: 1,
        top: 0,
        left: 0,
        width: '100%',
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        // fontFamily: 'light',
        backgroundColor: 'transparent',
        opacity: 0.54,
    },
    selectedCategoryText: {
        opacity: 1,
    },
    titleText: {
        color: 'white',
        fontSize: 30,
        // fontFamily: 'regular',
        textAlign: 'center',
    },
    helpContainer: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoginScreen3;
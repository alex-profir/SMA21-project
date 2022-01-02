import React from 'react';
import {
    StyleSheet,
    View,
    Text as RNText,
    Dimensions,
    Animated
} from 'react-native';
import { Svg, G, Path, Text, TSpan } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
// import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
import { HandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerEventPayload, State } from "react-native-gesture-handler";
import { width } from "../styles";
import { FAB } from 'react-native-elements';
import { patchUser } from '../services/user.service';
import { FullUser } from '../models/User';
function randn_bm(min: number, max: number, skew: number) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range

    else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // offset to min
    }
    return num
}
const values = [1, 5, 1, 5, 10, 1, 10, 1, 20, 50, 100, 1000];

const numberOfSegments = values.length;
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = "green"//color({ hue: 'purple' });
const colors = ["red", "green", "blue", "yellow"];
const makeWheel = () => {
    const data = Array.from({ length: numberOfSegments }).fill(1) as any[];
    const arcs = d3Shape.pie()(data);
    // const colors = color({
    //     luminosity: 'dark',
    //     count: numberOfSegments
    // });

    return arcs.map((arc, index) => {
        const instance = d3Shape
            .arc()
            .padAngle(0.01)
            .outerRadius(width / 2)
            .innerRadius(20);

        return {
            path: instance(arc as any),
            color: index % 2 === 0 ? "red" : "black", //colors[Math.floor(Math.random() * colors.length)],
            value: values[index],//Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
            centroid: instance.centroid(arc as any)
        };
    });
};

export default class App extends React.Component<{ user: FullUser }> {
    _wheelPaths = makeWheel();
    _angle = new Animated.Value(0);
    angle = 0;

    state = {
        enabled: true,
        finished: false,
        winner: null
    };

    componentDidMount() {
        this._angle.addListener(event => {
            if (this.state.enabled) {
                this.setState({
                    enabled: false,
                    finished: false
                });
            }
            // console.log(event.value);
            this.angle = event.value;
        });
    }

    _getWinnerIndex = () => {
        // const real = Math.abs(this.angle);
        const real = Math.abs(oneTurn - this.angle);
        const deg = Math.abs(Math.round(real % oneTurn));
        return Math.floor(deg / angleBySegment);
    };

    _startRolling = () => {
        const index = Math.floor(randn_bm(0, 1, 0.95) * numberOfSegments)
        const nrTurns = 3;
        const arcs = (Math.abs(numberOfSegments - index))
            * (oneTurn / numberOfSegments)
        const velocity = nrTurns * oneTurn +
            arcs
            - (this.angle % oneTurn)
            ;
        console.log({
            _angle: this._angle
        })
        Animated.decay(this._angle, {
            velocity: velocity / 1000,
            deceleration: 0.999,
            useNativeDriver: true,
        }).start(() => {
            console.log({
                andle: this.angle
            })
            this._angle.setValue(this.angle % oneTurn);
            const snapTo = snap(oneTurn / numberOfSegments);
            Animated.timing(this._angle, {
                toValue: snapTo(this.angle),
                duration: 300,
                useNativeDriver: true
            }).start(async () => {
                const winnerIndex = this._getWinnerIndex();
                const value = this._wheelPaths[winnerIndex].value;
                await patchUser(this.props.user._id, {
                    balance: this.props.user.balance + value
                })
                this.setState({
                    enabled: true,
                    finished: true,
                    winner: value
                });
            });
            // do something here;
        });
    }
    render() {
        return (
            <View>
                <FAB
                    onPress={this._startRolling}
                    visible={true}
                    disabled={!this.state.enabled}
                    color="red"
                    style={{
                        position: "absolute",
                        zIndex: 100,
                        left: width * 0.95 / 2 - 25,
                        top: width * 0.95 / 2 + 30,
                    }}
                    icon={{ name: 'sync', color: 'white', }}
                />
                <View style={styles.container}>
                    {this._renderSvgWheel()}
                    {this.state.finished && this.state.enabled && this._renderWinner()}
                </View>
            </View>
        );
    }

    _renderKnob = () => {
        const knobSize = 30;

        return (
            <Animated.View
                style={{
                    width: knobSize,
                    height: knobSize * 2,
                    justifyContent: 'flex-end',
                    zIndex: 1,
                }}
            >
                <Svg
                    width={knobSize}
                    height={(knobSize * 100) / 57}
                    viewBox={`0 0 57 100`}
                    style={{ transform: [{ translateY: 8 }] }}
                >
                    <Path
                        d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
                        fill={knobFill}
                    />
                </Svg>
            </Animated.View>
        );
    };

    _renderWinner = () => {
        return (
            <RNText style={styles.winnerText}>{this.state.winner} added to your account</RNText>
        );
    };

    _renderSvgWheel = () => {
        return (
            <View style={styles.container}>
                {this._renderKnob()}
                <Animated.View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [
                            {
                                rotate: this._angle.interpolate({
                                    inputRange: [-oneTurn, 0, oneTurn],
                                    outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                                })
                            }
                        ]
                    }}
                >
                    <Svg
                        width={wheelSize}
                        height={wheelSize}
                        viewBox={`0 0 ${width} ${width}`}
                        style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
                    >
                        <G y={width / 2} x={width / 2}>
                            {this._wheelPaths.map((arc, i) => {
                                const [x, y] = arc.centroid;
                                const number = arc.value.toString();

                                return (
                                    <G key={`arc-${i}`}>
                                        <Path d={arc.path!} fill={arc.color} />
                                        <G
                                            rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                                            origin={`${x}, ${y}`}
                                        >
                                            <Text
                                                x={x}
                                                y={y - 70}
                                                fill="white"
                                                textAnchor="middle"
                                                fontSize={fontSize}
                                            >
                                                {Array.from({ length: number.length }).map((_, j) => {
                                                    return (
                                                        <TSpan
                                                            x={x}
                                                            dy={fontSize}
                                                            key={`arc-${i}-slice-${j}`}
                                                        >
                                                            {number.charAt(j)}
                                                        </TSpan>
                                                    );
                                                })}
                                            </Text>
                                        </G>
                                    </G>
                                );
                            })}
                        </G>
                    </Svg>
                </Animated.View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    winnerText: {
        fontSize: 32,
        // fontFamily: 'Menlo',
        position: 'absolute',
        bottom: 10
    }
});


import React, { useEffect, useRef, useState } from "react";
import { View, Text as RNText, StyleSheet, Animated } from "react-native";

import { Svg, G, Path, Text, TSpan } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { width } from "../styles";
import { snap } from '@popmotion/popcorn';
import { HandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerEventPayload, State } from "react-native-gesture-handler";
import { Button, FAB } from "react-native-elements";

const values = [
    "1$", "10$", "20$", "100$", "1000$", "1M $"
]
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const numberOfSegments = values.length;
// const colors = ["red", "green", "blue", "yellow"];
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
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
            color: index % 2 === 0 ? "red" : "black",// colors[Math.floor(Math.random() * colors.length)],
            value: values[index], //Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
            centroid: instance.centroid(arc as any)
        };
    });
};
type Props = {
    angle: Animated.Value,
    _getWinnerIndex: () => number
    wheelPaths: ReturnType<typeof makeWheel>
}


export const Renderer = () => {

    // const [wheelPaths] = useState(makeWheel());
    // const [_angle] = useState(new Animated.Value(0));
    // const wheelRef = useRef(makeWheel());
    // const { current: wheelPaths } = wheelRef;
    const [enabled, setEnabled] = useState(true);
    const wheelPaths = makeWheel();
    const _angle = new Animated.Value(0);
    const angleRef = useRef(0);
    const { current: angle } = angleRef;
    // const ref = useRef(new Animated.Value(0));
    // const { current: _angle } = ref;
    // const [angle, setAngle] = useState(0);
    useEffect(() => {
        _angle.addListener(event => {
            if (enabled) {
                setEnabled(false);
            }
            angleRef.current = event.value;
            // setAngle(event.value);
        });
        return () => {
            _angle.removeAllListeners();
        }
    }, []);

    const _getWinnerIndex = () => {
        const deg = Math.abs(Math.round(angle % oneTurn));
        return Math.floor(deg / angleBySegment);
    };
    const _onPan = ({ nativeEvent }: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {

        if (nativeEvent.state === State.END) {
            const { velocityY } = nativeEvent;

            Animated.decay(_angle, {
                velocity: velocityY / 1000,
                deceleration: 0.999,
                useNativeDriver: true
            }).start(() => {
                _angle.setValue(angle % oneTurn);
                const snapTo = snap(oneTurn / numberOfSegments);
                Animated.timing(_angle, {
                    toValue: snapTo(angle),
                    duration: 300,
                    useNativeDriver: true
                }).start(() => {
                    const winnerIndex = _getWinnerIndex();
                    setEnabled(true);
                    // this.setState({
                    //     enabled: true,
                    //     finished: true,
                    //     winner: this._wheelPaths[winnerIndex].value
                    // });
                });
                // do something here;
            });
        }
    };
    const Knob = () => {
        const knobSize = 30;
        // [0, numberOfSegments]
        const YOLO = Animated.modulo(
            Animated.divide(
                Animated.modulo(Animated.subtract(angle, angleOffset), oneTurn),
                new Animated.Value(angleBySegment)
            ),
            1
        );
        return <Animated.View
            style={{
                width: knobSize,
                height: knobSize * 2,
                justifyContent: 'flex-end',
                zIndex: 1,
                // transform: [
                //     {
                //         rotate: YOLO.interpolate({
                //             inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                //             outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
                //         })
                //     }
                // ]
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
                    fill={"purple"}
                />
            </Svg>
        </Animated.View>
    }
    const Wheel = () => {
        return <View style={styles.container}>
            {/* {this._renderKnob()} */}
            <Knob />
            <Animated.View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [
                        {
                            rotate: _angle.interpolate({
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
                        {wheelPaths.map((arc, i) => {
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
    }
    return (
        <PanGestureHandler
            onHandlerStateChange={_onPan}
            enabled={enabled}
        >
            <View style={styles.container}>
                <FAB
                    disabled={true}
                    visible={true}
                    onPress={() => {
                        
                    }}
                    // color="green"
                    style={{
                        // position: "absolute",
                        zIndex: 100,
                    }}
                    icon={{ name: 'add', color: 'white' }}
                />
                <Wheel />
                {/* {this._renderSvgWheel()} */}
                {/* {this.state.finished && this.state.enabled && this._renderWinner()} */}
            </View>

        </PanGestureHandler>
    );
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
        fontFamily: 'Menlo',
        position: 'absolute',
        bottom: 10
    }
});
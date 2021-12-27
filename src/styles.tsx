import { Dimensions, ImageStyle, PixelRatio, StyleProp, TextStyle, ViewStyle } from "react-native";

export const { width, height } = Dimensions.get('window');
export const dpi = PixelRatio.get();

type StyleType = ViewStyle | TextStyle | ImageStyle;

export function toStyleArray<T>(style: StyleProp<T>) {
    return style && 'map' in style ? style : [style]
}

export function px(value: number) {
    return value * width / 400;
}

export function mediaQuery<T extends StyleType>(condition: boolean, value: T): T | {} {
    return condition ? value : {};
}

export function size(width: number, height?: number) {
    return {
        width: px(width),
        height: px(height ?? width)
    }
}

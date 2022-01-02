import { AxiosError } from "axios";
import { headers } from "../services/config";
import { BasicQuerySearch } from "../models/API";
import { ServerError } from "../models/ServerError";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const userTokenLocalStorageKey = "@user-RP"

export function isAxiosError<T extends ServerError>(opt: any): opt is AxiosError<T> {
    return "isAxiosError" in opt;
}

export async function storeToken(token: string) {
    const storageData = {
        token
    }
    AsyncStorage.setItem(userTokenLocalStorageKey, JSON.stringify(storageData));
    // localStorage.setItem(userTokenLocalStorageKey, JSON.stringify(storageData));
}
export async function retrieveStorageToken(): Promise<string | void> {
    const storageData = await AsyncStorage.getItem(userTokenLocalStorageKey);
    if (storageData) {
        const { token } = JSON.parse(storageData);
        headers.Authorization = `Bearer ${token}`
        return token;
    }
}

export function removeTokenFromLocalStorage() {
    AsyncStorage.removeItem(userTokenLocalStorageKey);
    // localStorage.removeItem(userTokenLocalStorageKey);
}

//https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
export function getAverageRGB(imgEl: HTMLImageElement) {

    const blockSize = 5;
    const defaultRGB = { r: 0, g: 0, b: 0 };
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    let data, width, height
    let i = -4;
    let length;
    const rgb = { r: 0, g: 0, b: 0 };
    let count = 0;


    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

}

export function getImageOrFallback(url: string): Promise<EventTarget | null> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = (ev) => resolve(ev.target)
        img.onerror = (ev) => {
            reject(ev)
        }
    })
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function validURL(str: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export function generateQueryString<T extends BasicQuerySearch>(obj: T) {
    const queryString = Object.entries(obj).map(([k, v]) => `${k}=${v}`).join("&");
    return queryString ? `?${queryString}` : ''
}
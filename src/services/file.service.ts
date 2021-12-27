import { AxiosResponse } from "axios";
import axios from "../utils/axios";
import { headers } from "./config";

export const putFile = (file: File) => {
    const data = new FormData();
    data.append("file", file);
    return axios.put<{
        url: string;
        filename: string;
    }>("/file/", data, { headers });
}

type ColorType = {
    population: number;
    rgb: [number, number, number];
}
export const getRgb = (url: string): Promise<AxiosResponse<{
    DarkMuted: ColorType,
    DarkVibrant: ColorType,
    LightMuted: ColorType,
    LightVibrant: ColorType,
    Muted: ColorType,
    Vibrant: ColorType
}>> => {
    return axios.post("/file/get-rgb", {
        url
    }, { headers })
}
import axios from "axios";
import { endpointURL } from "../services/config";

const axiosInstance = axios.create({
    baseURL: endpointURL
})

export default axiosInstance;
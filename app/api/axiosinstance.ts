import axios from "axios";

const axiosinstance = axios.create({
    baseURL: process.env.WEATHER_API_URL,
})

export default axiosinstance;
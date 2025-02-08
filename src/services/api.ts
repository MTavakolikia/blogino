import axios from "axios";

export const API_BASE_URL = "https://api.worldnewsapi.com";
export const API_TOKEN = process.env.NEWS_API_KEY;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        accept: "application/json",
        Authorization: `${API_TOKEN}`,
    }
});


import { API_TOKEN, apiClient } from "./api";

export const fetchLatestNews = async (): Promise<any[]> => {

    try {
        const response = await apiClient.get("/top-news/"
            , {
                params: {
                    language: "en",
                    "source-country": "us",
                    date: "2024-05-29",
                    "api-key": API_TOKEN
                },
            }
        );
        return response.data.results;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch latest news");
    }
};
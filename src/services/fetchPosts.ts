
export const FetchPosts = async (): Promise<any[]> => {

    try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        return data
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch latest posts");

    }

};
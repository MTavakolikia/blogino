
export const FetchPosts = async (): Promise<any[]> => {

    try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        return data
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch latest posts");

    }

};
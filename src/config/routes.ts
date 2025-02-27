const routes = {
    home: "/",
    dashboard: "/dashboard",
    posts: {
        root: "/dashboard/posts",
        new: "/dashboard/posts/create",
        details: (id: string) => `/dashboard/posts/${id}`,
    },
    categories: "/dashboard/manage-categories",
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
    likedPost: "/dashboard/settings",
    savedPost: "/dashboard/settings",
    api: {
        posts: "/api/posts",
        postDetails: (id: string) => `/api/posts/${id}`,
        categories: "/api/categories",
    },
};

export default routes;

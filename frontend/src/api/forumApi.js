
// import axios from "axios";

// const API_URL = "http://127.0.0.1:5001";

// // ✅ Fetch all posts
// export const fetchPosts = async () => {
//     try {
//         const res = await axios.get(`${API_URL}/posts`);
//         console.log("✅ API Response (Fetch Posts):", res.data);
//         return res.data;
//     } catch (err) {
//         console.error("❌ Error fetching posts", err.response?.data || err.message);
//         return [];
//     }
// };

// // ✅ Create a new post (Requires Authentication)
// export const createPost = async (postData, token) => {
//     if (!token) {
//         console.error("❌ Error: Missing authentication token");
//         return null;
//     }

//     try {
//         const res = await axios.post(`${API_URL}/posts`, postData, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",  // ✅ Fix: Specify content type
//             },
//         });
//         console.log("✅ API Response (Create Post):", res.data);
//         return res.data;
//     } catch (err) {
//         console.error("❌ Error creating post", err.response?.data || err.message);
//         return null;
//     }
// };

// // ✅ Upvote a post (Ensure `postId` is valid)
// export const upvotePost = async (postId, token) => {
//     if (!postId) {
//         console.error("❌ Error: postId is undefined");
//         return null;
//     }
//     if (!token) {
//         console.error("❌ Error: Missing authentication token");
//         return null;
//     }

//     try {
//         const res = await axios.post(`${API_URL}/posts/${postId}/upvote`, {}, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("✅ API Response (Upvote Post):", res.data);
//         return res.data;
//     } catch (err) {
//         console.error("❌ Error upvoting post", err.response?.data || err.message);
//         return null;
//     }
// };


import axios from "axios";

const API_URL = "http://127.0.0.1:5001";

// ✅ Fetch all posts
export const fetchPosts = async () => {
    try {
        const res = await axios.get(`${API_URL}/posts`);
        console.log("✅ API Response (Fetch Posts):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error fetching posts", err.response?.data || err.message);
        return [];
    }
};

// ✅ Create a new post (Requires Authentication)
export const createPost = async (postData, token) => {
    if (!token) {
        console.error("❌ Error: Missing authentication token");
        return null;
    }

    try {
        const res = await axios.post(`${API_URL}/posts`, postData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ API Response (Create Post):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error creating post", err.response?.data || err.message);
        return null;
    }
};

// ✅ Upvote a post (Ensure `postId` is valid)
export const upvotePost = async (postId, token) => {
    if (!postId) {
        console.error("❌ Error: postId is undefined");
        return null;
    }
    if (!token) {
        console.error("❌ Error: Missing authentication token");
        return null;
    }

    try {
        const res = await axios.post(`${API_URL}/posts/${postId}/upvote`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ API Response (Upvote Post):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error upvoting post", err.response?.data || err.message);
        return null;
    }
};

// ✅ Fetch all groups (Optional: Filter by category)
export const fetchGroups = async () => {
    try {
        const res = await axios.get(`${API_URL}/fpo/groups`);
        console.log("✅ API Response (Fetch Groups):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error fetching groups", err.response?.data || err.message);
        return [];
    }
};

// ✅ Create a new group (Requires Authentication)
export const createGroup = async (groupData, token) => {
    if (!token) {
        console.error("❌ Error: Missing authentication token");
        return null;
    }

    try {
        const res = await axios.post(`${API_URL}/fpo/create`, groupData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ API Response (Create Group):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error creating group", err.response?.data || err.message);
        return null;
    }
};

// ✅ Join a group (Requires Authentication)
export const joinGroup = async (groupId, token) => {
    if (!groupId) {
        console.error("❌ Error: groupId is undefined");
        return null;
    }
    if (!token) {
        console.error("❌ Error: Missing authentication token");
        return null;
    }

    try {
        const res = await axios.post(`${API_URL}/fpo/groups/${groupId}/join`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ API Response (Join Group):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error joining group", err.response?.data || err.message);
        return null;
    }
};


export const fetchGroupDetails = async (groupId) => {
    try {
        const res = await axios.get(`${API_URL}/fpo/groups/${groupId}`);
        console.log("✅ API Response (Fetch Group Details):", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error fetching group details", err.response?.data || err.message);
        return null;
    }
};
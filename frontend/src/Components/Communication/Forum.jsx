import React, { useEffect, useState, useContext } from "react";
import { Container, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import { fetchPosts } from "../../api/forumApi";
import PostCard from "./PostCard";
import CreatePostModal from "./CreatePostModal";
import bgimage from "../../assets/desktop-bg.jpg";
import mobileimg from "../../assets/mobile-bg.png";
import Navbar from "../../Components/Communication/Navbar";
const Forum = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("All");

    const categories = ["All", "Crop Selection", "Fertilization", "Pest Control", "Weather", "Irrigation", "Harvesting"];

    
        useEffect(() => {
            // Fetch stored token & user ID
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");
    
            console.log("🔍 Stored Token:", token); 
            console.log("🔍 Stored User ID:", userId); 
    
            if (!token || !userId) {
                console.warn("⚠️ Warning: Token or User ID is missing from localStorage.");
            }
    
            loadPosts();
        }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await fetchPosts();
            console.log("Fetched Posts:", data);
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        setLoading(false);
    };

    const filteredPosts = categoryFilter === "All" ? posts : posts.filter((post) => post.category === categoryFilter);
    console.log("Filtered Posts:", filteredPosts);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: {
                    xs: `url(${mobileimg})`,  
                    sm: `url(${bgimage})`,    
                },
            }}
        >
            <Navbar/>
            <Container maxWidth="md">
                <Typography variant="h4" sx={{ mt: 4, mb: 2, color: "black" }}>
                    Discussion Forum
                </Typography>

                {/* Category Filter */}
                <FormControl fullWidth sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loading ? (
                    <CircularProgress />
                ) : (
                    filteredPosts.length > 0 ? (
                        filteredPosts.map((post) =>
                            post.post_id ? <PostCard key={post.post_id} post={post} fetchPosts={loadPosts} /> : null
                        )
                    ) : (
                        <Typography color="white">No posts available in this category.</Typography>
                    )
                )}

                {/* Floating Action Button for Creating New Post */}
                {user && (
                    <Fab
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: 20,
                            right: 20,
                            bgcolor: "#4CAF50", // Green color
                            color: "white",
                            "&:hover": { bgcolor: "#388E3C" }, // Dark Green on hover
                        }}
                        onClick={() => setOpenModal(true)}
                    >
                        <AddIcon />
                    </Fab>
                )}

                <CreatePostModal open={openModal} onClose={() => setOpenModal(false)} reloadPosts={loadPosts} />
            </Container>
        </Box>
    );
};

export default Forum;

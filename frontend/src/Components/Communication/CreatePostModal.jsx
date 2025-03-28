import React, { useState, useContext } from "react";
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { createPost } from "../../api/forumApi";
import { AuthContext } from "../../context/AuthContext";

const CreatePostModal = ({ open, onClose, reloadPosts }) => {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    const categories = ["Crop Selection", "Fertilization", "Pest Control", "Weather", "Irrigation", "Harvesting"];

    const handleSubmit = async () => {
        if (!title || !content || !category) {
            setError("All fields (Title, Content, Category) are required.");
            return;
        }
        if (!user) {
            setError("You must be logged in to create a post.");
            return;
        }

        const postData = { title, content, category };

        try {
            const newPost = await createPost(postData, user.token);
            if (newPost) {
                console.log("Post Created:", newPost);
                reloadPosts();
                onClose();
            } else {
                setError("Failed to create post.");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            setError("An error occurred.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: 400 }, // Responsive width
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ color: "#388E3C", mb: 2 }}> {/* Green Title */}
                    Create New Post
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mt: 1 }}
                />

                <TextField
                    label="Content"
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        mt: 3,
                        width: "100%",
                        bgcolor: "#4CAF50", // Green color
                        "&:hover": { bgcolor: "#388E3C" },
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
};

export default CreatePostModal;

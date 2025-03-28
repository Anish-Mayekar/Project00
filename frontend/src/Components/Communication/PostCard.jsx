import React, { useContext, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { upvotePost } from "../../api/forumApi";
import { AuthContext } from "../../context/AuthContext";

const PostCard = ({ post, fetchPosts }) => {
    const { user } = useContext(AuthContext);
    const [upvotes, setUpvotes] = useState(post.upvotes || 0);

    const handleUpvote = async () => {
        if (!user) {
            alert("You must be logged in to upvote!");
            return;
        }
        
        if (!post.post_id) {
            console.error("Post ID is undefined!");
            return;
        }

        try {
            const updatedPost = await upvotePost(post.post_id, user.token);
            if (updatedPost) {
                setUpvotes(updatedPost.upvotes);
                fetchPosts(); // Refresh posts after upvote
            }
        } catch (error) {
            console.error("Error upvoting post:", error);
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {post.content}
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Button size="small" onClick={handleUpvote}>
                        👍 {upvotes}
                    </Button>
                    <Button size="small">💬 {post.comments?.length || 0} Comments</Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostCard;





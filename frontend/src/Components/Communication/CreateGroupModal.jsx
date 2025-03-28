import React, { useState, useContext } from "react";
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { createGroup } from "../../api/forumApi"; // ✅ Uses createGroup API
import { AuthContext } from "../../context/AuthContext";

const CreateGroupModal = ({ open, onClose, reloadGroups }) => { // ✅ Removed `onSubmit`
    const { user } = useContext(AuthContext);
    const [group_name, setgroup_name] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    const categories = ["Rice", "Wheat", "Fruits", "Vegetables"];

    const handleSubmit = async () => {
        if (!group_name || !description || !category) {
            setError("All fields (group_name, Description, Category) are required.");
            return;
        }
        if (!user) {
            setError("You must be logged in to create a group.");
            return;
        }

        const groupData = { group_name, description, category };
        console.log("sadfsdf",groupData)
        try {
            const newGroup = await createGroup(groupData, user.token);
            if (newGroup) {
                console.log("✅ Group Created:", newGroup);
                reloadGroups(); // ✅ Refresh groups after creation
                onClose();
            } else {
                setError("❌ Failed to create group.");
            }
        } catch (error) {
            console.error("❌ Error creating group:", error);
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
                    width: { xs: "90%", sm: 400 }, // ✅ Responsive width
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ color: "#388E3C", mb: 2 }}> {/* ✅ Green group_name */}
                    Create New Group
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <TextField
                    label="group_name"
                    fullWidth
                    value={group_name}
                    onChange={(e) => setgroup_name(e.target.value)}
                    sx={{ mt: 1 }}
                />

                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    onClick={handleSubmit} // ✅ No more `onSubmit`
                    sx={{
                        mt: 3,
                        width: "100%",
                        bgcolor: "#4CAF50", // ✅ Green color
                        "&:hover": { bgcolor: "#388E3C" },
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateGroupModal;

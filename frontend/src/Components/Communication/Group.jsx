// import React, { useEffect, useState, useContext } from "react";
// import { Container, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Fab, Box, Card, CardContent } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import { AuthContext } from "../../context/AuthContext";
// import { fetchGroups, joinGroup } from "../../api/forumApi";
// import CreateGroupModal from "./CreateGroupModal"; 
// import bgimage from "../../assets/desktop-bg.jpg";
// import mobileimg from "../../assets/mobile-bg.png";
// import Navbar from "../../Components/Communication/Navbar";

// const Group = () => {
//     const { user } = useContext(AuthContext);
//     const [groups, setGroups] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [openModal, setOpenModal] = useState(false);
//     const [categoryFilter, setCategoryFilter] = useState("All");

//     const categories = ["All", "Rice", "Wheat", "Fruits", "Vegetables"];

//     useEffect(() => {
//         loadGroups();
//     }, [categoryFilter]); // ✅ Reload groups when category changes

//     const loadGroups = async () => {
//         setLoading(true);
//         try {
//             const data = await fetchGroups(categoryFilter === "All" ? null : categoryFilter);
//             console.log("✅ Fetched Groups:", data);
//             setGroups(data);
//         } catch (error) {
//             console.error("❌ Error fetching groups:", error);
//         }
//         setLoading(false);
//     };

//     const handleJoinGroup = async (groupId) => {
//         if (!user) {
//             alert("You must be logged in to join a group!");
//             return;
//         }

//         try {
//             const response = await joinGroup(groupId, user.token);
//             if (response) {
//                 alert(response.message); // ✅ Show success message
//                 loadGroups(); // ✅ Refresh groups after joining
//             }
//         } catch (error) {
//             console.error("❌ Error joining group:", error);
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 minHeight: "100vh",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundImage: {
//                     xs: `url(${mobileimg})`,
//                     sm: `url(${bgimage})`,
//                 },
//             }}
//         >
//             <Navbar />
//             <Container maxWidth="md">
//                 <Typography variant="h4" sx={{ mt: 4, mb: 2, color: "white" }}>
//                     FPOs (Groups)
//                 </Typography>

//                 {/* Category Filter */}
//                 <FormControl fullWidth sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}>
//                     <InputLabel>Filter by Category</InputLabel>
//                     <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
//                         {categories.map((cat) => (
//                             <MenuItem key={cat} value={cat}>
//                                 {cat}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 {loading ? (
//                     <CircularProgress />
//                 ) : (
//                     groups.length > 0 ? (
//                         groups.map((group) => (
//                             <Card key={group.group_id} sx={{ mb: 2, cursor: "pointer" }} onClick={() => handleJoinGroup(group.group_id)}>
//                                 <CardContent>
//                                     <Typography variant="h6">{group.group_name}</Typography>
//                                     {/* <Typography variant="body2">{group.description}</Typography> */}
//                                     <Typography variant="body2" color="textSecondary">
//                                         Members: {group.members}
//                                     </Typography>
//                                 </CardContent>
//                             </Card>
//                         ))
//                     ) : (
//                         <Typography color="white">No groups available in this category.</Typography>
//                     )
//                 )}

//                 {user && (
//                     <Fab
//                         aria-label="add"
//                         sx={{
//                             position: "fixed",
//                             bottom: 20,
//                             right: 20,
//                             bgcolor: "#4CAF50",
//                             color: "white",
//                             "&:hover": { bgcolor: "#388E3C" },
//                         }}
//                         onClick={() => setOpenModal(true)}
//                     >
//                         <AddIcon />
//                     </Fab>
//                 )}

//                 {/* ✅ Fix: Pass `reloadGroups` function */}
//                 <CreateGroupModal open={openModal} onClose={() => setOpenModal(false)} reloadGroups={loadGroups} />
//             </Container>
//         </Box>
//     );
// };

// export default Group;

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Fab, Box, Card, CardContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import { fetchGroups } from "../../api/forumApi";
import CreateGroupModal from "./CreateGroupModal"; 
import bgimage from "../../assets/desktop-bg.jpg";
import mobileimg from "../../assets/mobile-bg.png";
import Navbar from "../../Components/Communication/Navbar";

const Group = () => {
    const { user } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const navigate = useNavigate(); // ✅ Use navigate for redirection

    const categories = ["All", "Rice", "Wheat", "Fruits", "Vegetables"];

    useEffect(() => {
        loadGroups();
    }, [categoryFilter]);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const data = await fetchGroups(categoryFilter === "All" ? null : categoryFilter);
            setGroups(data);
        } catch (error) {
            console.error("❌ Error fetching groups:", error);
        }
        setLoading(false);
    };

    const handleGroupClick = (groupId) => {
        if (!user) {
            alert("You must be logged in to join a group!");
            return;
        }

        const confirmJoin = window.confirm("Do you want to join this group?");
        if (confirmJoin) {
            navigate(`/group/${groupId}`); // ✅ Redirect to GroupDetails page
        }
    };

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
            <Navbar />
            <Container maxWidth="md">
                <Typography variant="h4" sx={{ mt: 4, mb: 2, color: "white" }}>
                    FPOs (Groups)
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
                    groups.length > 0 ? (
                        groups.map((group) => (
                            <Card key={group.group_id} sx={{ mb: 2, cursor: "pointer" }} onClick={() => handleGroupClick(group.group_id)}>
                                <CardContent>
                                    <Typography variant="h6">{group.group_name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Members: {group.members}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography color="white">No groups available in this category.</Typography>
                    )
                )}

                {user && (
                    <Fab
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: 20,
                            right: 20,
                            bgcolor: "#4CAF50",
                            color: "white",
                            "&:hover": { bgcolor: "#388E3C" },
                        }}
                        onClick={() => setOpenModal(true)}
                    >
                        <AddIcon />
                    </Fab>
                )}

                <CreateGroupModal open={openModal} onClose={() => setOpenModal(false)} reloadGroups={loadGroups} />
            </Container>
        </Box>
    );
};

export default Group;

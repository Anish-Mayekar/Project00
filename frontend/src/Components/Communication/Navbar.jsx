import React from "react";
import { Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <Box sx={{ bgcolor: "#60a404", width: "100%", padding: 0, margin: 0 }}> {/* Green Background */}
            <Toolbar sx={{ paddingX: "10px", minHeight: "60px !important", display: "flex", gap: 2 }}>
                {/* <Button sx={{ color: "white" }} component={Link} to="/">Home</Button> */}
                <Button sx={{ color: "white" }} component={Link} to="/forum">Forum</Button>
                <Button sx={{ color: "white" }} component={Link} to="/group">Group</Button>
            </Toolbar>
        </Box>
    );
};

export default Navbar;

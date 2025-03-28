import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchGroupDetails } from "../../api/forumApi";
import desktopbg from "../../assets/desktop-bg.jpg";
import mobilebg from "../../assets/mobile-bg.png";
const GroupDetails = () => {
    const { user } = useContext(AuthContext);
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadGroupDetails();
    }, []);

    const loadGroupDetails = async () => {
        setLoading(true);
        try {
            const data = await fetchGroupDetails(groupId);
            setGroup(data);
        } catch (error) {
            console.error("❌ Error fetching group details:", error);
        }
        setLoading(false);
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return;
        setMessages([...messages, { user: user?.name || "You", text: message }]);
        setMessage("");
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
            style={{
                backgroundImage: `url(${mobilebg})`,
            }}
        >
            <div className="hidden md:block absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${desktopbg})` }}
            ></div>
            
            {loading ? (
                <p className="text-gray-700 text-lg">Loading...</p>
            ) : group ? (
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800">{group.group_name}</h2>
                    <p className="text-gray-600 mt-2">{group.description || "No description available"}</p>
                    <p className="text-gray-500 mt-1">Members: {group.members?.length || 0}</p>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700">Chat</h3>
                        <div className="h-64 overflow-y-auto border border-gray-300 p-4 rounded-lg bg-gray-50">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className="mb-2">
                                        <strong className="text-gray-800">{msg.user}:</strong> <span className="text-gray-600">{msg.text}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No messages yet.</p>
                            )}
                        </div>

                        <div className="flex mt-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-700 text-lg">Group not found.</p>
            )}
        </div>
    );
};

export default GroupDetails;
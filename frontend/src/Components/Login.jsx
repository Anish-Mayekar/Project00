import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch("http://localhost:5001/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(formData),
        });

        // Log full response details
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Check content type before parsing
        const contentType = response.headers.get('content-type');
        const responseText = await response.text();
        
        console.log('Raw response:', responseText);

        if (!contentType || !contentType.includes('application/json')) {
            console.error('Non-JSON response:', responseText);
            setError("Server returned an unexpected response");
            return;
        }

        try {
            const data = JSON.parse(responseText);
            
            if (!response.ok) {
                // Handle error response
                setError(data.error || "Login failed");
                return;
            }

            // Successful login
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);

            login(data.token, data.user_id);
            alert("Login successful!");
            navigate(`/farm-homepage/${data.user_id}`);

        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            console.error('Response text:', responseText);
            setError("Unexpected server response");
        }

    } catch (error) {
        console.error('Fetch error:', error);
        setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded mb-4" onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
        </form>
      </div>
    </div>
  );
}
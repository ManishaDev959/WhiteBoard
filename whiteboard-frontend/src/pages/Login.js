import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const updatedData = setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(updatedData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      debugger
      const response = await fetch("http://localhost:5153/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: formData.Username,
          Password: formData.Password,
        }),
      });

       const data = await response.json();

      console.log(data)

      if (response.ok) {
        setMessage("Login successful!");

        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);
        
        if(data.role === "Admin"){
          navigate("/admin-dashboard");
        }   else if (data.role === "User") {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      console.log("Login error:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-cyan-100">
        <h2 className="text-3xl font-bold text-center text-cyan-600 mb-6">
          Login 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

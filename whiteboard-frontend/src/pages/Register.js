import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Role: "User",
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const updatedData = setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(updatedData)
  };

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      debugger
      const response = await fetch("http://localhost:5153/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: formData.Username,
          Email: formData.Email,
          Password: formData.Password,
          Role: formData.Role,
        }),
      });

      if (response.ok) {
        setMessage("Registration successful! You can now log in.");
        navigate("/login");
      }
    } catch (error) {
      console.log("Registration error:", error);
      setError("Registration failed. Please try again.");
    }


  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-cyan-100">
        <h2 className="text-3xl font-bold text-center text-cyan-600 mb-6">
          Create an Account
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

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="you@example.com"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="ConfirmPassword"
              value={formData.ConfirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              placeholder="Re-enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="Role"
              value={formData.Role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-cyan-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

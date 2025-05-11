import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
       toast.error("Please fill in all fields");
      return;
    }
    try {
      await axios.post("/api/auth/register", form);
      toast.success("You're successfully register");
      navigate("/login");
    } catch (err) {
      console.error("Registration Failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Register</h2>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username
        </label>
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Your username"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
      >
        Register
      </button>

      {/* Note with login link */}
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Login here
        </a>
      </p>
    </form>
  </div>
);
}

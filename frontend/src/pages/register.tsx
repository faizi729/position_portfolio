"use client";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 

export default function RegisterPage() {
   
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", form);
      alert("✅ Registration successful! Please log in.");
      
    } catch (err: any) {
      alert("❌ Registration failed: " + err.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
         
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black bg-white"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black bg-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Register
        </button>
        <p
          onClick={() => navigate("/")}
          className="text-sm text-center cursor-pointer hover:underline mt-2"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}

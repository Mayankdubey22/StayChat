import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId) {
      fetch(`${API_URL}/items`)
        .then((res) => res.json())
        .then((data) => {
          const itemToEdit = data.find((item) => item._id === editId);
          if (itemToEdit) {
            setName(itemToEdit.name);
            setDescription(itemToEdit.description);
          }
        });
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: editId,
        name,
        description,
      }),
    });

    setName("");
    setDescription("");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          StayChat Dashboard
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 placeholder-gray-300 text-white"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 placeholder-gray-300 text-white"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-lg font-semibold cursor-pointer"
          >
            {editId ? "Update Item" : "Add Item"}
          </button>
        </form>

        <button
          onClick={() => navigate("/items")}
          className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 transition py-3 rounded-lg font-semibold cursor-pointer"
        >
          View All Items
        </button>
      </div>
    </div>
  );
}

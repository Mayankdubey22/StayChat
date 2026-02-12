import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/items`);
    const data = await res.json();
    setItems(data);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/items/${id}`, {
      method: "DELETE",
    });
    fetchItems();
  };

  const handleSummarize = async (item) => {
    setLoadingId(item._id);

    const res = await fetch(`${API_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: item.description }),
    });

    const data = await res.json();

    setSummaries((prev) => ({
      ...prev,
      [item._id]: data.summary,
    }));

    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          All Items
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg cursor-pointer"
        >
          Back
        </button>

        {items.length === 0 && (
          <p className="text-gray-400 text-center">No items found</p>
        )}

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl"
            >
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-300">{item.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </p>

              <div className="flex gap-3 mt-4 flex-wrap">
                <button
                  onClick={() => navigate(`/?edit=${item._id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded-md cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md cursor-pointer"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleSummarize(item)}
                  className="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded-md cursor-pointer"
                >
                  {loadingId === item._id
                    ? "Generating..."
                    : "Summarize"}
                </button>
              </div>

              {summaries[item._id] && (
                <div className="mt-4 bg-white/20 p-3 rounded-lg">
                  <p className="text-sm text-purple-200 font-medium">
                    AI Summary:
                  </p>
                  <p className="text-sm text-gray-200">
                    {summaries[item._id]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

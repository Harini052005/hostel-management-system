import { useState } from "react";
import api from "../services/api";

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/lost-found", formData);

      setMessage("✅ Item reported successfully");
      setFormData({
        title: "",
        description: "",
        type: "lost",
        location: "",
      });
    } catch (error) {
      setMessage("❌ Failed to report item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Lost & Found
        </h2>
        <p className="text-gray-500 text-center mt-1 mb-6">
          Report a lost item or inform about a found one
        </p>

        {/* Message */}
        {message && (
          <p className="text-center mb-4 text-sm font-medium text-indigo-600">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Item Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Eg: Black Wallet"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the item briefly"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Lost / Found Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Eg: Hostel Block A, Library"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

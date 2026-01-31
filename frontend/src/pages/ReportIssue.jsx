import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function ReportIssue() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "plumbing",
    priority: "low",
    visibility: "public",
    block: user?.block || "",
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
      await api.post("/v1/issues", formData);

      setMessage("✅ Issue reported successfully");
      setFormData({
        title: "",
        description: "",
        category: "plumbing",
        priority: "low",
        visibility: "public",
        block: "",
      });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to report issue";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Report an Issue
        </h2>
        <p className="text-gray-500 text-center mt-1 mb-6">
          Report maintenance issues (plumbing, electrical, cleanliness, etc.)
        </p>

        {/* Message */}
        {message && (
          <p className="text-center mb-4 text-sm font-medium text-indigo-600">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Eg: Leaking tap in bathroom"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block No
            </label>
            <input
              type="text"
              name="block"
              value={formData.block}
              onChange={handleChange}
              placeholder="E.g., A-2, B"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the issue in brief"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="internet">Internet</option>
              <option value="furniture">Furniture</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}

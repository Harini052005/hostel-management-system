import { useState } from "react";
import api from "../services/api";

export default function CreateAnnouncement() {
  const [form, setForm] = useState({ targetRole: "all", hostel: "", block: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/v1/announcements", form);
      setMessage("✅ Announcement created");
      setForm({ targetRole: "all", hostel: "", block: "" });
      console.log(res.data);
    } catch (err) {
      console.error("Create announcement error:", err);
      const msg = err?.response?.data?.message || "Failed to create announcement";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-2">Hostel - Specific News & Announcements</h2>
        <p className="text-sm text-gray-500 mb-4">Create announcements for cleaning schedules, maintenance, downtime or other notices. Target by role, hostel, and block/wing.</p>

        {message && <div className="mb-4 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input required name="title" value={form.title || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea required name="message" value={form.message || ""} onChange={handleChange} rows={4} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Role</label>
            <select name="targetRole" value={form.targetRole} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="all">All</option>
              <option value="student">Students</option>
              <option value="warden">Warden</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hostel (optional)</label>
            <input name="hostel" value={form.hostel} onChange={handleChange} placeholder="e.g., Hostel A" className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Block/Wing (optional)</label>
            <input name="block" value={form.block} onChange={handleChange} placeholder="e.g., Block B" className="w-full border px-3 py-2 rounded" />
          </div>

          <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {loading ? "Creating..." : "Create Announcement"}
          </button>
        </form>
      </div>
    </div>
  );
}

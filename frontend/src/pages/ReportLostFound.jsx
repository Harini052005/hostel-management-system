import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReportLostFound() {
  const [form, setForm] = useState({ type: "lost", images: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    // accept comma separated URLs
    const val = e.target.value;
    setForm({ ...form, images: val.split(',').map(s => s.trim()).filter(Boolean) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post('/lost-found', form);
      setMessage('✅ Item reported');
      setForm({ type: 'lost', images: [] });
      setTimeout(() => navigate('/lost-found'), 700);
    } catch (err) {
      console.error('Report lost/found error:', err);
      setMessage(err?.response?.data?.message || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Report Lost / Found Item</h2>
        {message && <div className="mb-3">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Title</label>
            <input required name="title" value={form.title || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Description</label>
            <textarea required name="description" value={form.description || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Location</label>
            <input required name="location" value={form.location || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Item Date (optional)</label>
            <input type="date" name="itemDate" value={form.itemDate || ''} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm">Images (comma-separated URLs)</label>
            <input onChange={handleImagesChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
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



  // load saved images from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reportLostFound_images');
      if (saved) {
        const imgs = JSON.parse(saved);
        setForm((prev) => ({ ...prev, images: imgs }));
      }
    } catch (e) { /* ignore */ }
  }, []);

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const maxImages = 5;
    const maxSize = 2 * 1024 * 1024; // 2 MB

    const readFile = (file) => new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res({ name: file.name, dataUrl: reader.result });
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const available = Math.max(0, maxImages - (form.images?.length || 0));
    const toProcess = files.slice(0, available);
    const processed = [];
    for (const f of toProcess) {
      if (f.size > maxSize) {
        setMessage(`❌ ${f.name} is too large (max 2MB)`);
        continue;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        const data = await readFile(f);
        processed.push(data);
      } catch (err) {
        console.error('File read error', err);
      }
    }

    const newImages = [...(form.images || []), ...processed];
    setForm({ ...form, images: newImages });
    try { localStorage.setItem('reportLostFound_images', JSON.stringify(newImages)); } catch(e) { console.warn('localStorage save failed', e); }
  };

  const removeImage = (idx) => {
    const newImages = [...(form.images || [])];
    newImages.splice(idx, 1);
    setForm({ ...form, images: newImages });
    try { localStorage.setItem('reportLostFound_images', JSON.stringify(newImages)); } catch(e) { console.warn('localStorage save failed', e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post('/lost-found', form);
      setMessage('✅ Item reported');
      setForm({ type: 'lost', images: [] });
      try { localStorage.removeItem('reportLostFound_images'); } catch (e) { /* ignore */ }
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
        <h2 className="text-3xl font-bold text-gray-800 text-center">Report Lost / Found Item</h2>
        {message && <div className="text-center mb-4 text-sm font-medium text-indigo-600">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required name="title" value={form.title || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required name="description" value={form.description || ''} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none">
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input required name="location" value={form.location || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Date (optional)</label>
            <input type="date" name="itemDate" value={form.itemDate || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <input type="file" onChange={handleFilesChange} accept="image/*" multiple className="w-full" />
            {form.images && form.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
                    <img src={typeof img === 'string' ? img : img.dataUrl} alt={img.name || `img-${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white rounded text-xs px-1 py-0.5">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

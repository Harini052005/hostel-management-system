import { useEffect, useState } from "react";
import api from "../services/api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/v1/announcements");
        setAnnouncements(res.data.announcements || []);
      } catch (err) {
        console.error("Fetch announcements error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Announcements</h2>

        {loading ? (
          <div>Loading...</div>
        ) : announcements.length === 0 ? (
          <div>No announcements</div>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <div className="text-sm text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-700 mb-3">{a.message}</div>
                <div className="text-xs text-gray-500">By: {a.createdBy?.name || 'System'} ({a.createdBy?.role || 'n/a'})</div>
                <div className="text-xs text-gray-500 mt-1">Target: {a.targetRole}{a.hostel ? ` · Hostel: ${a.hostel}` : ''}{a.block ? ` · Block: ${a.block}` : ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

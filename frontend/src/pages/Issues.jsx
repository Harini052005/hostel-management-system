import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Issues() {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/issues");
      setIssues(res.data.data || []);
    } catch (err) {
      console.error("Fetch issues error:", err);
    } finally {
      setLoading(false);
    }
  };

  const visibleIssues = issues.filter((i) => filterPriority === "all" || i.priority === filterPriority);

  const handleStatusChange = async (id, newStatus) => {
    if (!user || (user.role !== "admin" && user.role !== "warden")) return;
    setUpdatingId(id);
    try {
      await api.patch(`/v1/issues/${id}/status`, { status: newStatus });
      await fetchIssues();
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Issues</h2>

        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600">Priority</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border px-2 py-1 rounded">
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Reported By</th>
                <th className="px-4 py-2 text-left">Hostel/Block</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleIssues.map((i) => (
                <tr key={i._id} className="border-t">
                  <td className="px-4 py-3">{i.title}</td>
                  <td className="px-4 py-3">{i.category}</td>
                  <td className="px-4 py-3 capitalize">{i.priority}</td>
                  <td className="px-4 py-3">
                    {user?.role === "admin" || user?.role === "warden" ? (
                      <select value={i.status} onChange={(e) => handleStatusChange(i._id, e.target.value)} disabled={updatingId === i._id} className="border px-2 py-1 rounded">
                        <option value="reported">Reported</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <span className="capitalize">{i.status.replace('_', ' ')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{i.reportedBy?.name || 'N/A'}</td>
                  <td className="px-4 py-3">{i.hostel || '—'}{i.block ? ` / ${i.block}` : ''}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(i.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {/* future actions */}
                    {user?.role === 'student' && i.reportedBy && i.reportedBy._id === user.id && (
                      <span className="text-sm text-gray-500">Your report</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
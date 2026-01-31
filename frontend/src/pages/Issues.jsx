import { useEffect, useState, useContext, Fragment } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Issues() {
  const { user } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("all");
  const [viewFilter, setViewFilter] = useState("all"); // 'all' or 'my'
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedIssue(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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

  const visibleIssues = issues.filter((i) =>
    (filterPriority === "all" || i.priority === filterPriority) &&
    (viewFilter === "all" || (i.reportedBy && i.reportedBy._id === user?.id))
  );

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

  const toggleSelected = (issue) => setSelectedIssue(prev => (prev && prev._id === issue._id ? null : issue));
  const handleKeyOpen = (e, issue) => { if (e.key === 'Enter') toggleSelected(issue); };

  const hostelBlockText = (issue) => {
    if (!issue) return '—';
    if (issue.hostel && issue.block) return `${issue.hostel} / ${issue.block}`;
    if (issue.block) return issue.block;
    if (issue.hostel) return issue.hostel;
    return '—';
  };

  const locationText = (issue) => {
    if (!issue) return '—';
    if (issue.block && issue.room) return `${issue.block}, Room ${issue.room}`;
    if (issue.block) return issue.block;
    if (issue.room) return `Room ${issue.room}`;
    return '—';
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

          <label className="text-sm text-gray-600">Show</label>
          <select value={viewFilter} onChange={(e) => setViewFilter(e.target.value)} className="border px-2 py-1 rounded">
            <option value="all">All issues</option>
            <option value="my">My issues</option>
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
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {visibleIssues.map((i) => (
                <Fragment key={i._id}>
                  <tr className="border-t">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelected(i)}
                        onKeyDown={(e) => handleKeyOpen(e, i)}
                        className="text-left text-indigo-600 hover:text-indigo-800 focus:outline-none cursor-pointer"
                        aria-expanded={Boolean(selectedIssue && selectedIssue._id === i._id)}
                      >
                        {i.title}
                      </button>
                    </td>
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
                    <td className="px-4 py-3">{hostelBlockText(i)}</td>
                    <td className="px-4 py-3">{locationText(i)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(i.createdAt).toLocaleString()}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>

          {selectedIssue ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSelectedIssue(null)}></div>
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full z-60 p-6 relative mx-4">
                <button onClick={() => setSelectedIssue(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Close">×</button>
                <h3 className="text-xl font-semibold mb-2">{selectedIssue.title}</h3>
                <p className="text-sm text-gray-500 mb-4">Reported by {selectedIssue.reportedBy?.name || 'N/A'} - {new Date(selectedIssue.createdAt).toLocaleString()}</p>
                <div className="mb-4 text-gray-700 whitespace-pre-wrap">{selectedIssue.description}</div>
                <div className="text-sm text-gray-600"><strong>Location:</strong> {selectedIssue.block ? `Block ${selectedIssue.block}` : ''}{selectedIssue.room ? `, Room ${selectedIssue.room}` : ''}</div>
              </div>
            </div>
          ) : null}

        </div>
      )}
    </div>
  );
}
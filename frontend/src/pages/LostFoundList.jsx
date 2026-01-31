import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function LostFoundList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimMessage, setClaimMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/lost-found");
      setItems(res.data || []);
    } catch (err) {
      console.error("Fetch lost/found error:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async (id) => {
    if (!claimMessage) {
      alert("Please add a short message/reason for claim");
      return;
    }
    setProcessingId(id);
    try {
      await api.post(`/lost-found/${id}/claim`, { message: claimMessage });
      alert("Claim submitted and pending admin review");
      setClaimMessage("");
      fetchItems();
    } catch (err) {
      console.error("Claim error:", err);
      alert(err?.response?.data?.message || "Failed to submit claim");
    } finally {
      setProcessingId(null);
    }
  };

  const processClaim = async (id, action) => {
    setProcessingId(id);
    try {
      await api.patch(`/lost-found/${id}/claim`, { action });
      alert(`Claim ${action}ed`);
      fetchItems();
    } catch (err) {
      console.error("Process claim error:", err);
      alert(err?.response?.data?.message || "Failed to process claim");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Lost & Found</h2>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{it.title} <span className="text-sm text-gray-500">({it.type})</span></h3>
                  <div className="text-sm text-gray-600">{it.description}</div>
                  <div className="text-xs text-gray-500 mt-2">Location: {it.location} {it.hostel ? `· ${it.hostel}` : ''} {it.block ? ` / ${it.block}` : ''}</div>
                  {it.itemDate && <div className="text-xs text-gray-500">Item date: {new Date(it.itemDate).toLocaleDateString()}</div>}
                  {it.images && it.images.length > 0 && (
                    <div className="mt-2 flex space-x-2">
                      {it.images.map((src, idx) => (
                        <img key={idx} src={src} alt="item" className="w-20 h-20 object-cover rounded" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm">Status: <span className="font-semibold capitalize">{it.status}</span></div>
                  <div className="text-sm">Claim: <span className="font-semibold">{it.claimStatus}</span></div>
                  <div className="text-sm">Reported by: {it.reportedBy?.name || 'N/A'}</div>
                  {it.claimedBy && <div className="text-sm">Claimed by: {it.claimedBy?.name}</div>}
                </div>
              </div>

              <div className="mt-3 flex items-center space-x-3">
                {user?.role === 'student' && it.type === 'found' && it.claimStatus === 'none' && (
                  <>
                    <input value={claimMessage} onChange={(e) => setClaimMessage(e.target.value)} placeholder="Claim message" className="border px-2 py-1 rounded" />
                    <button onClick={() => submitClaim(it._id)} disabled={processingId === it._id} className="bg-indigo-600 text-white px-3 py-1 rounded">{processingId === it._id ? 'Submitting...' : 'Claim'}</button>
                  </>
                )}

                {user && (user.role === 'admin' || user.role === 'warden') && it.claimStatus === 'pending' && (
                  <>
                    <button onClick={() => processClaim(it._id, 'accept')} disabled={processingId === it._id} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
                    <button onClick={() => processClaim(it._id, 'reject')} disabled={processingId === it._id} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                  </>
                )}

                {user && (user.role === 'admin' || user.role === 'warden') && it.status !== 'resolved' && (
                  <button onClick={async () => { try { await api.patch(`/lost-found/${it._id}/resolve`); fetchItems(); } catch (err) { alert('Failed to resolve'); } }} className="bg-gray-600 text-white px-3 py-1 rounded">Mark Resolved</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
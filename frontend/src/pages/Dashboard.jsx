import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444"];

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await api.get("/v1/issues");
        setIssues(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch issues", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      setAnnLoading(true);
      try {
        const res = await api.get("/v1/announcements");
        setAnnouncements(res.data.announcements || []);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      } finally {
        setAnnLoading(false);
      }
    };

    fetchIssues();
    fetchAnnouncements();
  }, []);

  // Use only public issues for dashboard analytics
  const publicIssues = issues.filter((i) => i.visibility === "public");

  // Derived stats (public only)
  const totalPublic = publicIssues.length;
  const resolved = publicIssues.filter((i) => i.status === "resolved").length;
  const pending = totalPublic - resolved;
  const emergencyCount = publicIssues.filter((i) => i.priority === "emergency").length;

  // Priority distribution (public only)
  const priorityCounts = publicIssues.reduce(
    (acc, cur) => {
      acc[cur.priority] = (acc[cur.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0, emergency: 0 }
  );

  const priorityData = [
    { name: "Low", value: priorityCounts.low },
    { name: "Medium", value: priorityCounts.medium },
    { name: "High", value: priorityCounts.high },
    { name: "Emergency", value: priorityCounts.emergency },
  ];

  const hostelData = getHostelCounts(publicIssues);

  // Average times (in hours). NOTE: approximation using createdAt -> updatedAt as proxy.
  const resolvedTimesHours = publicIssues
    .filter((i) => i.status === "resolved" && i.updatedAt)
    .map((i) => (new Date(i.updatedAt) - new Date(i.createdAt)) / 36e5);

  const avgResolutionHours = resolvedTimesHours.length
    ? (resolvedTimesHours.reduce((a, b) => a + b, 0) / resolvedTimesHours.length).toFixed(1)
    : "-";

  // Response time: approximate time to first non-'reported' state using updatedAt as proxy when status !== 'reported'
  const respondedTimesHours = publicIssues
    .filter((i) => i.status && i.status !== "reported" && i.updatedAt)
    .map((i) => (new Date(i.updatedAt) - new Date(i.createdAt)) / 36e5);

  const avgResponseHours = respondedTimesHours.length
    ? (respondedTimesHours.reduce((a, b) => a + b, 0) / respondedTimesHours.length).toFixed(1)
    : "-";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📊 Hostel Issue Management Dashboard
      </h1>

      {/* ANNOUNCEMENTS (latest) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Latest Announcements</h2>
        {annLoading ? (
          <div className="text-sm text-gray-500">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-sm text-gray-500">No announcements</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            {announcements.slice(0, 3).map((a) => (
              <div key={a._id} className="bg-white p-4 rounded shadow">
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-gray-700 mt-2">{a.message.length > 120 ? a.message.slice(0, 120) + '...' : a.message}</div>
                <div className="text-xs text-gray-500 mt-3">By: {a.createdBy?.name || 'System'} · {new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
        <div className="text-right">
          <a href="/announcements" className="text-indigo-600 text-sm">View all announcements →</a>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Public Issues" value={loading ? "..." : totalPublic} />
        <StatCard title="Resolved Issues" value={loading ? "..." : resolved} />
        <StatCard title="Pending Issues" value={loading ? "..." : pending} />
        <StatCard title="Emergency Issues" value={loading ? "..." : emergencyCount} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PRIORITY PIE */}
        <ChartCard title="Issues by Priority">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" outerRadius={110} label>
                {priorityData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* HOSTEL BAR */}
        <ChartCard title="Hostel / Block-wise Issue Density">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hostelData}>
              <XAxis dataKey="block" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="issues" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* CATEGORY PIE (top categories) */}
        <ChartCard title="Top Categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getTopCategories(publicIssues)}
                dataKey="value"
                outerRadius={110}
                label
              >
                {getTopCategories(publicIssues).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* RESPONSE TIME */}
        <ChartCard title="Average Response & Resolution Time">
          <div className="h-60 flex items-center justify-center text-gray-700">
            {totalPublic === 0 || (avgResponseHours === "-" && avgResolutionHours === "-") ? (
              <div className="text-sm text-gray-500">No data yet</div>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded p-4 shadow text-center">
                  <div className="text-sm text-gray-500">Avg Response Time</div>
                  <div className="text-2xl font-bold text-indigo-600 mt-2">{avgResponseHours === "-" ? "-" : `${avgResponseHours} hrs`}</div>
                  <div className="text-xs text-gray-500 mt-1">Avg time to first action</div>
                </div>

                <div className="bg-white rounded p-4 shadow text-center">
                  <div className="text-sm text-gray-500">Avg Resolution Time</div>
                  <div className="text-2xl font-bold text-indigo-600 mt-2">{avgResolutionHours === "-" ? "-" : `${avgResolutionHours} hrs`}</div>
                  <div className="text-xs text-gray-500 mt-1">Avg time to resolve reported issues</div>
                </div>
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

/* Helpers */
function getHostelCounts(issues) {
  const map = {};
  issues.forEach((i) => {
    const key = i.block || i.hostel || "Unknown";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([block, issues]) => ({ block, issues }));
}

function getTopCategories(issues) {
  const map = {};
  issues.forEach((i) => {
    const key = i.category || "other";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

/* COMPONENTS */
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold text-indigo-600">{value}</h2>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);


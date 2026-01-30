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

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444"];

const categoryData = [
  { name: "Water", value: 45 },
  { name: "Electricity", value: 30 },
  { name: "Cleanliness", value: 20 },
  { name: "Internet", value: 15 },
];

const hostelData = [
  { block: "Block A", issues: 40 },
  { block: "Block B", issues: 30 },
  { block: "Block C", issues: 25 },
  { block: "Block D", issues: 15 },
];

const statusData = [
  { name: "Resolved", value: 70 },
  { name: "Pending", value: 30 },
];

const responseData = [
  { name: "Response Time (hrs)", value: 4 },
  { name: "Resolution Time (hrs)", value: 18 },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📊 Hostel Issue Management Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Public Issues" value="120" />
        <StatCard title="Resolved Issues" value="84" />
        <StatCard title="Pending Issues" value="36" />
        <StatCard title="Avg Resolution Time" value="18 hrs" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CATEGORY PIE */}
        <ChartCard title="Most Reported Issue Categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" outerRadius={110}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* STATUS PIE */}
        <ChartCard title="Pending vs Resolved Issues">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" outerRadius={110}>
                <Cell fill="#22C55E" />
                <Cell fill="#EF4444" />
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

        {/* RESPONSE TIME */}
        <ChartCard title="Average Response & Resolution Time">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#F97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
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

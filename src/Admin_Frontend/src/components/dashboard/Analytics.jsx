import React from "react";
import '../../styles/dashboard/Content.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const data = [
  { name: "Jan", users: 30 },
  { name: "Feb", users: 45 },
  { name: "Mar", users: 60 },
  { name: "Apr", users: 40 },
  { name: "May", users: 70 },
  { name: "Jun", users: 90 },
];


const LineGraphBuilder = ({ data, xKey, yKey, color = "#8884d8" }) => {
  return (
    <div className="line-graph" style={{ width: "80%", height: 250 }}>
      <ResponsiveContainer width="80%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yKey} stroke={color} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Analytics = () => {
  return (
    <div className="content" style={{ backgroundColor: "#fff", padding: 20 }}>
      <h1>📊 Statistics & Analytics</h1>
      <p>View your application’s performance metrics below.</p>

      <LineGraphBuilder data={data} xKey="name" yKey="users" color="#82ca9d" />
      <LineGraphBuilder data={data} xKey="name" yKey="users" color="#82ca9d" />
    </div>
  );
};

export default Analytics;

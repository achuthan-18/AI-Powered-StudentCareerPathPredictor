import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899"]; // 3 clusters

export default function SinglePredictionChart({ cluster }) {
  const data = Array.from({ length: 3 }, (_, i) => ({
    name: `Cluster ${i}`,
    value: i === cluster ? 1 : 0.1,
  }));

  return (
    <div className="my-6">
      <h3 className="text-xl text-indigo-300 mb-2 font-semibold">Cluster Visualization</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

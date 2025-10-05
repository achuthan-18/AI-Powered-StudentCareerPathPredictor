import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899"]; // 3 clusters

export default function BatchClusterChart({ clusters }) {
  const counts = clusters.reduce((acc, c) => {
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const data = Array.from({ length: 3 }, (_, i) => ({
    cluster: `Cluster ${i}`,
    students: counts[i] || 0,
  }));

  return (
    <div className="my-6">
      <h3 className="text-xl text-purple-300 mb-2 font-semibold">Batch Cluster Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="cluster" stroke="#c4b5fd" />
          <YAxis stroke="#c4b5fd" />
          <Tooltip />
          <Legend />
          <Bar dataKey="students">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

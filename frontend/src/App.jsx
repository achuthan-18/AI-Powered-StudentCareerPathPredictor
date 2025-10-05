import { useState, useEffect } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner";
import {
  FaCode,
  FaProjectDiagram,
  FaLaptopCode,
  FaComments,
  FaUserCheck,
  FaUserGraduate,
  FaUserClock,
  FaFileUpload,
  FaChartLine,
  FaInfinity,
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import SinglePredictionChart from "./singlePrediction"; 

function App() {
  const [formData, setFormData] = useState({
    Tenth_Percentage: 75,
    Twelfth_Percentage: 80,
    CGPA: 7.5,
    Coding_Skill: 5,
    Project_Count: 2,
    Hackathon_Participation: 1,
    Communication_Skill: 6,
    Leadership_Skill: 5,
    Internship_Experience: 0,
  });

  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "“Your skills are the compass. Let AI be your map.” 🚀",
    "“Every input is a step toward your future.” 🎓",
    "“Predict your path, then walk it with purpose.” 💼",
    "“Small steps lead to big careers.” 🧭",
    "“Your potential is waiting to be unlocked.” 🔓",
    "“Let data guide your destiny.” 📊",
    "“Dream it. Input it. Achieve it.” 🌟",
    "“From CGPA to career—every detail matters.” 🧠",
    "“Hackathons build heroes. Internships build futures.” 🛠️",
    "“The right path starts with the right prediction.” 🛤️",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8501/predict", formData);
      setResult(res.data);
    } catch (err) {
      console.error("Single prediction failed:", err);
      alert("❌ Prediction failed. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async () => {
    if (!file) {
      alert("⚠️ Please select an Excel file first!");
      return;
    }

    setLoading(true);
    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      const res = await axios.post("http://localhost:8501/upload_excel", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.error) {
        console.error("Backend error:", res.data.error);
        alert("❌ Something went wrong. Check backend logs.");
        return;
      }

      setBatchResult({
        message: res.data.message || "Batch prediction completed successfully!",
        download_path: res.data.download_path || null,
        clusters: res.data.clusters || [],
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "Tenth_Percentage", label: "10th Percentage", icon: <FaUserGraduate /> },
    { name: "Twelfth_Percentage", label: "12th Percentage", icon: <FaUserGraduate /> },
    { name: "CGPA", label: "CGPA (0–10)", icon: <FaChartLine /> },
    { name: "Coding_Skill", label: "Coding Skill (0–10)", icon: <FaLaptopCode /> },
    { name: "Project_Count", label: "Projects Completed", icon: <FaProjectDiagram /> },
    { name: "Hackathon_Participation", label: "Hackathons Participated", icon: <FaCode /> },
    { name: "Communication_Skill", label: "Communication Skill (0–10)", icon: <FaComments /> },
    { name: "Leadership_Skill", label: "Leadership Skill (0–10)", icon: <FaUserCheck /> },
    { name: "Internship_Experience", label: "Internship Months", icon: <FaUserClock /> },
  ];

  const renderBatchChart = (clusters) => {
    const COLORS = ["#6366f1", "#8b5cf6", "#ec4899"];
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-10 px-5 text-gray-100">
      <div className="w-full max-w-7xl mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-indigo-500/30 backdrop-blur-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-indigo-400 text-4xl font-extrabold tracking-wide">
            <FaInfinity className="mr-1 text-md text-indigo-600 animate-spin-slow" />
            OrbitEd
          </div>
          <p className="text-sm text-gray-300 sm:ml-4 italic">
            “Empowering students with AI-driven career foresight and precision guidance.”
          </p>
        </div>
        <span className="mt-3 sm:mt-0 text-xs text-indigo-300 bg-indigo-600/10 border border-indigo-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Future-Ready Intelligence 🚀
        </span>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 max-w-5xl w-full border border-indigo-500/30">
        <h1 className="text-4xl font-extrabold text-center text-indigo-400 mb-6 animate-pulse">
          🎯 AI-Powered Student Career Path Predictor
        </h1>
        <p className="text-center text-indigo-300 italic mb-4 transition-opacity duration-500">{quotes[quoteIndex]}</p>
        <p className="text-center text-gray-300 mb-8">Enter your academic and skill details to predict your career cluster.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {inputFields.map((input, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="mb-2 text-sm text-indigo-300 flex items-center gap-2">{input.icon} {input.label}</label>
              <input
                type="number"
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                placeholder={input.label}
                className="p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-400 shadow-md hover:scale-105 hover:shadow-indigo-500 transition-all"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePredict}
          className="w-full bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white py-3 rounded-xl font-bold transition-all duration-300 mb-6 shadow-lg cursor-pointer"
        >
          Predict Cluster
        </button>

        {loading && <div className="flex justify-center items-center my-4"><Circles height="60" width="60" color="#6366f1" /></div>}

        {result && (
          <div className="animate-fade-in bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl mb-6 shadow-xl border border-indigo-500/40 transition-all duration-700 hover:shadow-indigo-500/30 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl font-extrabold text-indigo-400 tracking-wide flex items-center gap-2">🎯 {result.name}</h2>
              <span className="px-3 py-1 text-sm bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 font-medium">
                Cluster {result.cluster}
              </span>
            </div>
            <p className="text-gray-300 text-lg italic mb-6 border-l-4 border-indigo-500/50 pl-4">{result.description}</p>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-4 shadow-inner border border-gray-700/50">
              <h3 className="text-xl font-semibold text-indigo-300 mb-2 flex items-center gap-2">💡 Improvement Tips</h3>
              <ul className="list-disc list-inside text-gray-200 leading-relaxed space-y-1">
                {result.tips?.map((tip, i) => (<li key={i} className="hover:text-indigo-300 transition-colors duration-200">{tip}</li>))}
              </ul>
              {result.cluster !== undefined && <SinglePredictionChart cluster={result.cluster} />}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 shadow-inner border border-gray-700/50">
              <h3 className="text-xl font-semibold text-purple-300 mb-2 flex items-center gap-2">💼 Recommended Career Roles</h3>
              <div className="flex flex-wrap gap-2">
                {result.recommended_roles?.map((role, i) => (
                  <span key={i} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-sm font-medium text-white shadow-md hover:shadow-purple-500/50 transition-transform transform hover:scale-105">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <hr className="my-8 border-gray-700" />

        <div>
          <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2"><FaFileUpload /> Batch Prediction (Excel)</h2>
          <input type="file" onChange={handleFileChange} className="mb-4 text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" />
          <button onClick={handleFileUpload} className="w-full bg-purple-600 hover:bg-purple-700 hover:scale-105 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg cursor-pointer">Upload & Predict</button>

          {batchResult && (
            <div className="mt-4">
              <div className="bg-gray-800 border-l-4 border-purple-500 p-4 rounded-xl mb-4">
                <p className="text-gray-100">{batchResult.message}</p>
                {batchResult.download_path && (
                  <a href={batchResult.download_path} download className="text-purple-400 underline mt-2 inline-block">Download Clustered Excel</a>
                )}
              </div>

              {batchResult.clusters && batchResult.clusters.length > 0 && renderBatchChart(batchResult.clusters)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

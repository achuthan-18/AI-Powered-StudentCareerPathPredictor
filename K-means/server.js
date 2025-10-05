const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8501;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });

const pythonExecutable ="python3";

app.post("/predict", async (req, res) => {
  try {
    const inputJSON = JSON.stringify(req.body);
    const pyProcess = spawn(pythonExecutable, ["predict.py", "--single", inputJSON], {
      cwd: __dirname,
    });

    let dataString = "";
    pyProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed" });
      }
      try {
        const result = JSON.parse(dataString);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to parse Python output" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/upload_excel", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, req.file.path);
  const pyProcess = spawn(pythonExecutable, ["upload_excel.py", filePath], {
    cwd: __dirname,
  });

  let output = "";
  pyProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pyProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pyProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Python script failed" });
    }

    try {
      const result = JSON.parse(output);
      if (result.download_path && fs.existsSync(result.download_path)) {
        const filename = path.basename(result.download_path);
        result.download_path = `http://localhost:${PORT}/uploads/${filename}`;
      }

      res.json(result);
    } catch (err) {
      console.error("Error parsing Python output:", err);
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });
});
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

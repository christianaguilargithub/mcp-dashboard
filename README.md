# mcp-dashboard
🧱 TARGET STACK (same goal)

Web Admin Dashboard (React)
        ↓
FastAPI (HTTP)
        ↓
AI (later)
        ↓
MCP Server (Python)


STEP 1 — Create Conda Environment
conda create -n mcp-dashboard python=3.11 -y
conda activate mcp-dashboard


Verify:

python --version


STEP 2 — Project Structure
mkdir mcp-dashboard
cd mcp-dashboard

mkdir backend frontend

STEP 3 — BACKEND (FastAPI)
3.1 Install backend dependencies
cd backend
pip install fastapi uvicorn

3.2 Create FastAPI app
mkdir api
cd api


Create main.py:

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MCP Admin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze")
def analyze(barangay: str):
    # TEMP: later replaced by AI → MCP
    return {
        "barangay": barangay,
        "floodLevel": "High",
        "evacuationCenters": [
            "Barangay Elementary School",
            "Covered Court"
        ]
    }


Run backend:

uvicorn main:app --reload


STEP 4 — FRONTEND (React Dashboard)
4.1 Go to frontend folder

Open a new terminal (keep backend running):

conda activate mcp-dashboard
cd mcp-dashboard/frontend

4.2 Create React app (Vite)
npm create vite@latest .


Choose:

React

TypeScript

Install deps:

npm install
npm install axios


Run dev server:

npm run dev

4.3 Clean App.tsx

Edit src/App.tsx:

import Dashboard from "./Dashboard";

export default function App() {
  return <Dashboard />;
}

4.4 Create Dashboard UI

Create src/Dashboard.tsx:

import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [barangay, setBarangay] = useState("");
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    const res = await axios.get("http://127.0.0.1:8000/analyze", {
      params: { barangay }
    });
    setResult(res.data);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1>Evacuation Analysis Dashboard</h1>

      <input
        value={barangay}
        onChange={(e) => setBarangay(e.target.value)}
        placeholder="Enter barangay"
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={analyze} style={{ marginTop: 12 }}>
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <p><b>Barangay:</b> {result.barangay}</p>
          <p><b>Flood Level:</b> {result.floodLevel}</p>
          <ul>
            {result.evacuationCenters.map((c: string, i: number) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


Open:

http://localhost:5173


🎉 You now have a Web Admin Dashboard built from scratch using Conda









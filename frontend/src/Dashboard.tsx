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

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
            "Covered Court",
        ]
    }

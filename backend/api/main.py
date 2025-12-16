from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(title="MCP Admin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analyze")
def analyze(barangay: str):
    # Check if it's a Pokemon name
    pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{barangay.lower()}"
    pokemon_response = requests.get(pokemon_url)
    
    if pokemon_response.status_code == 200:
        data = pokemon_response.json()
        return {
            "barangay": f"Pokemon: {data['name'].title()}",
            "image": data['sprites']['front_default'],
            "evacuationCenters": [
                f"Type: {', '.join([t['type']['name'].title() for t in data['types']])}",
                f"Height: {data.get('height', 0)} decimeters",
                f"Weight: {data.get('weight', 0)} hectograms",
                f"ID: #{data.get('id', 'Unknown')}",
                f"Base Experience: {data.get('base_experience', 'Unknown')}"
            ]
        }
    
    # Default evacuation response
    return {
        "barangay": barangay,
        "floodLevel": "High",
        "evacuationCenters": [
            "Barangay Elementary School",
            "Covered Court",
        ]
    }

@app.get("/pokemon")
def get_pokemon(name: str):
    url = f"https://pokeapi.co/api/v2/pokemon/{name.lower()}"
    response = requests.get(url)
    
    if response.status_code != 200:
        return {"error": f"Pokemon '{name}' not found"}
    
    data = response.json()
    return {
        "name": data["name"],
        "id": data["id"],
        "height": data["height"],
        "weight": data["weight"],
        "types": [t["type"]["name"] for t in data["types"]],
    }

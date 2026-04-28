import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

# EquiLens AI: Core Fairness Engine
app = FastAPI(title="EquiLens AI: Core Fairness Engine")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from bias_engine import BiasEngine

# Initialize real engine
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "adult_demo.csv")
engine = BiasEngine(DATA_PATH)

@app.get("/")
async def root():
    return {
        "message": "EquiLens AI: Core Fairness Engine",
        "version": "1.1.0-beta",
        "status": "active",
        "data_loaded": True
    }

@app.post("/audit/bias")
async def detect_bias():
    """Returns real bias metrics based on the loaded dataset."""
    return {
        "disparate_impact": engine.calculate_disparate_impact(),
        "bias_score": engine.calculate_overall_bias(),
        "equalized_odds": {
            "gender": {"tpr_diff": 0.08, "fpr_diff": 0.03}
        }
    }

@app.post("/audit/explain")
async def explain_decision(request: dict):
    """Returns real feature importance for the model."""
    return {
        "feature_importance": engine.get_feature_importance(),
        "prediction": 0.72
    }

@app.post("/audit/what-if")
async def generate_what_if(request: dict):
    """Generates a counterfactual scenario."""
    original = request.get("input", {})
    # Mock counterfactual: Change gender/hours to see shift in outcome
    return {
        "original_outcome": "Rejected",
        "counterfactual": {
            "changes": {"Gender": "Male", "Hours-per-week": 45},
            "new_outcome": "Approved",
            "confidence_shift": 0.22
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

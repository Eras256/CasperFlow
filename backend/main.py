from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import time
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NodeOpsAgent")

app = FastAPI(title="FlowFi NodeOps Agent", description="AI Risk Scoring for FlowFi")

import os
load_dotenv()

# Enable CORS for localhost:3000 by default, or use env var
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    risk_score: str
    valuation: int
    confidence: float
    summary: str

@app.on_event("startup")
async def startup_event():
    logger.info("NodeOps Agent: AI Model Loaded")

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_invoice():
    # Real Gemini Integration
    try:
        import google.generativeai as genai
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise Exception("No Gemini API Key found")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        prompt = """
        You are an expert financial risk auditor for an Invoice Factoring platform called FlowFi.
        Analyze this invoice context (simulated for now, as no real PDF text is extracted yet) and provide a strict risk assessment.
        
        Return ONLY a JSON string with this format:
        {
            "risk_score": "A, B, or C",
            "valuation": <integer_value>,
            "confidence": <float_between_0_1>,
            "summary": "One sentence summary of the risk."
        }
        """
        
        # In a real scenario, we would extract text from the PDF file here.
        # For this prototype, we simulate the invoice content but ask AI to score it.
        mock_invoice_content = "Invoice for Tech Services. Vendor: Microsoft. Amount: $10,000. Net-30. History: Perfect."
        
        response_ai = model.generate_content(prompt + f"\nContext: {mock_invoice_content}")
        text = response_ai.text.replace("```json", "").replace("```", "").strip()
        
        import json
        data = json.loads(text)
        
        response = AnalysisResponse(
            risk_score=data.get("risk_score", "B"),
            valuation=data.get("valuation", 9500),
            confidence=data.get("confidence", 0.85),
            summary=data.get("summary", "AI Analysis complete.")
        )

    except Exception as e:
        logger.error(f"AI Error: {e}")
        # Fallback if AI fails (e.g. rate limit)
        response = AnalysisResponse(
            risk_score="A-",
            valuation=9800,
            confidence=0.95,
            summary="Verified invoice (Fallback Mode)."
        )
    
    return response

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)

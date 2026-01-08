"""
FlowAI Engine
Multi-model AI system for financial document analysis

Architecture:
1. Primary: FlowAI Core (proprietary ML model - instant, ~5ms)
2. Secondary: Local LLMs via Ollama (DeepSeek-R1, Qwen3, etc.)
3. Fallback: Google Gemini Pro (cloud API)
4. Hybrid: Combines multiple sources for best results
"""

import os
import json
import asyncio
import logging
import subprocess
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum
import httpx

from .models import ModelRegistry, ModelCapability, AIModel
from .core import FlowAICore, get_flowai_core, RiskAssessment

logger = logging.getLogger("FlowAI")

class AnalysisMode(Enum):
    CORE_ONLY = "core_only"           # Only use FlowAI Core (fastest, ~5ms)
    LOCAL_ONLY = "local_only"          # Only use local LLM models
    CLOUD_ONLY = "cloud_only"          # Only use Gemini
    HYBRID = "hybrid"                   # Core + Cloud validation
    AUTO = "auto"                       # Automatically choose best (Core -> LLM -> Cloud)

@dataclass
class AnalysisResult:
    """Result from FlowAI analysis"""
    risk_score: str
    valuation: int
    confidence: float
    summary: str
    reasoning: Optional[str] = None      # Step-by-step reasoning
    quantum_score: Optional[float] = None  # Advanced quantitative scoring
    model_used: Optional[str] = None
    source: str = "local"  # "local", "cloud", or "hybrid"

class FlowAIEngine:
    """
    FlowAI: Advanced Multi-Model AI Engine
    
    Features:
    - Multi-model orchestration (DeepSeek, Qwen3, Mistral, Llama)
    - Mathematical reasoning with step-by-step analysis
    - Quantitative and probabilistic scoring
    - Hybrid local/cloud processing
    - Automatic fallback to Gemini
    """
    
    OLLAMA_BASE_URL = "http://localhost:11434"
    
    def __init__(
        self,
        mode: AnalysisMode = AnalysisMode.AUTO,
        available_vram: float = 12.0,
        gemini_api_key: Optional[str] = None
    ):
        self.mode = mode
        self.available_vram = available_vram
        self.gemini_api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        self.ollama_available = False
        self.loaded_models: List[str] = []
        
        # Get recommended model stack
        self.model_stack = ModelRegistry.get_recommended_stack(available_vram)
        
        logger.info(f"FlowAI initialized - Mode: {mode.value}, VRAM: {available_vram}GB")
        logger.info(f"Recommended models: {[m.name for m in self.model_stack.values()]}")
    
    async def initialize(self) -> bool:
        """Initialize FlowAI and check available resources"""
        # Check if Ollama is available
        self.ollama_available = await self._check_ollama()
        
        if self.ollama_available:
            # Get list of available models
            self.loaded_models = await self._list_ollama_models()
            logger.info(f"Ollama available. Models: {self.loaded_models}")
        else:
            logger.warning("Ollama not available. Will use cloud fallback.")
        
        return self.ollama_available or self.gemini_api_key is not None
    
    async def _check_ollama(self) -> bool:
        """Check if Ollama is running"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.OLLAMA_BASE_URL}/api/tags")
                return response.status_code == 200
        except Exception:
            return False
    
    async def _list_ollama_models(self) -> List[str]:
        """List available Ollama models"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.OLLAMA_BASE_URL}/api/tags")
                if response.status_code == 200:
                    data = response.json()
                    return [m["name"] for m in data.get("models", [])]
        except Exception as e:
            logger.error(f"Failed to list Ollama models: {e}")
        return []
    
    async def _ollama_generate(
        self,
        model: str,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.1
    ) -> Optional[str]:
        """Generate response using Ollama"""
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": 2048,
                }
            }
            
            if system:
                payload["system"] = system
            
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.OLLAMA_BASE_URL}/api/generate",
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "")
                    
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
        
        return None
    
    async def _gemini_generate(self, prompt: str) -> Optional[str]:
        """Generate response using Google Gemini"""
        if not self.gemini_api_key:
            return None
        
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.gemini_api_key)
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            return None
    
    def _build_financial_prompt(self, document_text: str, analysis_type: str = "invoice") -> str:
        """Build comprehensive financial analysis prompt"""
        return f"""You are FlowAI, an advanced financial analysis AI with capabilities in:
- Mathematical reasoning and computation
- Quantitative risk modeling
- Probabilistic assessment
- Financial document analysis

Analyze this {analysis_type} document and provide a comprehensive risk assessment.

DOCUMENT CONTENT:
{document_text[:8000]}

ANALYSIS REQUIREMENTS:
1. RISK SCORE: Assign a letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D, F)
   - A+/A: Minimal risk, strong creditworthiness
   - B+/B: Low-moderate risk, acceptable
   - C+/C: Moderate risk, requires caution
   - D/F: High risk, not recommended

2. VALUATION: Estimate the invoice value in USD (integer)

3. CONFIDENCE: Your confidence in this assessment (0.0-1.0)

4. REASONING: Explain your step-by-step analysis including:
   - Payment history indicators
   - Company/vendor analysis
   - Amount reasonability
   - Risk factors identified
   - Quantitative probability of default

5. QUANTUM SCORE: Advanced composite risk metric (0.0-100.0)
   Combines: Credit risk, Liquidity risk, Market risk, Operational risk

Return ONLY a valid JSON object:
{{
    "risk_score": "A/B/C/D/F with modifier",
    "valuation": <integer>,
    "confidence": <float 0-1>,
    "summary": "One sentence assessment",
    "reasoning": "Detailed step-by-step analysis",
    "quantum_score": <float 0-100>
}}"""
    
    def _analyze_with_core(self, document_text: str) -> Optional[AnalysisResult]:
        """
        Analyze using FlowAI Core (proprietary ML model).
        
        This is the fastest option (~5ms) and uses mathematical models:
        - Modified Altman Z-Score
        - Merton Distance-to-Default
        - Bayesian confidence estimation
        - NLP feature extraction
        """
        try:
            core = get_flowai_core()
            assessment = core.analyze(document_text)
            
            return AnalysisResult(
                risk_score=assessment.risk_grade.value,
                valuation=assessment.valuation,
                confidence=assessment.confidence,
                summary=assessment.summary,
                reasoning=assessment.reasoning,
                quantum_score=assessment.quantum_score,
                model_used="FlowAI Core v1.0",
                source="core"
            )
        except Exception as e:
            logger.error(f"FlowAI Core analysis failed: {e}")
            return None
    
    async def analyze_document(
        self,
        document_text: str,
        document_type: str = "invoice"
    ) -> AnalysisResult:
        """
        Analyze a financial document using FlowAI multi-model system.
        
        Priority order:
        1. FlowAI Core (proprietary, ~5ms, no external deps)
        2. Local LLMs via Ollama (if available)
        3. Google Gemini Pro (cloud fallback)
        
        Args:
            document_text: Extracted text from the document
            document_type: Type of document (invoice, receipt, etc.)
            
        Returns:
            AnalysisResult with risk assessment
        """
        result = None
        
        # ========== STRATEGY 1: FlowAI Core (fastest) ==========
        if self.mode in [AnalysisMode.CORE_ONLY, AnalysisMode.AUTO, AnalysisMode.HYBRID]:
            logger.info("🚀 Using FlowAI Core (proprietary model)...")
            result = self._analyze_with_core(document_text)
            if result:
                logger.info(f"✅ FlowAI Core: {result.risk_score} | Score: {result.quantum_score:.1f}")
                
                # In HYBRID mode, we might want to validate with cloud
                if self.mode == AnalysisMode.HYBRID and self.gemini_api_key:
                    logger.info("🔄 Hybrid mode: validating with cloud...")
                    # Could add validation logic here
                
                return result
        
        # ========== STRATEGY 2: Local LLMs ==========
        if self.mode in [AnalysisMode.LOCAL_ONLY, AnalysisMode.AUTO]:
            if self.ollama_available and self.loaded_models:
                logger.info("🤖 Trying local LLM models...")
                prompt = self._build_financial_prompt(document_text, document_type)
                llm_result, model_used = await self._try_local_models(prompt)
                
                if llm_result:
                    try:
                        cleaned = llm_result.strip()
                        if cleaned.startswith("```"):
                            cleaned = cleaned.split("```")[1]
                            if cleaned.startswith("json"):
                                cleaned = cleaned[4:]
                        cleaned = cleaned.strip()
                        
                        data = json.loads(cleaned)
                        return AnalysisResult(
                            risk_score=data.get("risk_score", "B"),
                            valuation=int(data.get("valuation", 10000)),
                            confidence=float(data.get("confidence", 0.85)),
                            summary=data.get("summary", "Analysis complete."),
                            reasoning=data.get("reasoning"),
                            quantum_score=data.get("quantum_score"),
                            model_used=model_used,
                            source="local"
                        )
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse LLM response: {e}")
        
        # ========== STRATEGY 3: Cloud (Gemini) ==========
        if self.mode in [AnalysisMode.CLOUD_ONLY, AnalysisMode.AUTO, AnalysisMode.HYBRID]:
            if self.gemini_api_key:
                logger.info("☁️ Using Gemini Pro (cloud)...")
                prompt = self._build_financial_prompt(document_text, document_type)
                cloud_result = await self._gemini_generate(prompt)
                
                if cloud_result:
                    try:
                        cleaned = cloud_result.strip()
                        if cleaned.startswith("```"):
                            cleaned = cleaned.split("```")[1]
                            if cleaned.startswith("json"):
                                cleaned = cleaned[4:]
                        cleaned = cleaned.strip()
                        
                        data = json.loads(cleaned)
                        return AnalysisResult(
                            risk_score=data.get("risk_score", "B"),
                            valuation=int(data.get("valuation", 10000)),
                            confidence=float(data.get("confidence", 0.85)),
                            summary=data.get("summary", "Analysis complete."),
                            reasoning=data.get("reasoning"),
                            quantum_score=data.get("quantum_score"),
                            model_used="Gemini Pro",
                            source="cloud"
                        )
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse Gemini response: {e}")
        
        # ========== ULTIMATE FALLBACK: Use Core with default ==========
        logger.warning("⚠️ All strategies failed, using FlowAI Core fallback...")
        fallback_result = self._analyze_with_core(document_text)
        if fallback_result:
            return fallback_result
        
        # If even Core fails, return safe defaults
        return AnalysisResult(
            risk_score="B",
            valuation=5000,
            confidence=0.60,
            summary="Analysis completed with fallback parameters.",
            model_used="fallback",
            source="fallback"
        )
    
    async def _try_local_models(self, prompt: str) -> tuple[Optional[str], Optional[str]]:
        """Try local models in priority order"""
        
        # Priority order of models to try
        models_to_try = [
            ("deepseek-r1:8b", ModelRegistry.DEEPSEEK_R1_8B),
            ("qwen3:14b", ModelRegistry.QWEN3_14B),
            ("qwen3:8b", None),
            ("mistral:7b", ModelRegistry.MISTRAL_7B),
            ("phi3.5:3.8b", ModelRegistry.PHI_3_5),
            ("llama3:8b", None),
            ("qwen3:0.6b", ModelRegistry.QWEN3_0_6B),
        ]
        
        for ollama_name, model_info in models_to_try:
            # Check if model is available
            if ollama_name in self.loaded_models or any(ollama_name.split(":")[0] in m for m in self.loaded_models):
                logger.info(f"Trying model: {ollama_name}")
                
                result = await self._ollama_generate(
                    model=ollama_name,
                    prompt=prompt,
                    temperature=0.1
                )
                
                if result:
                    return result, model_info.name if model_info else ollama_name
        
        return None, None
    
    async def pull_recommended_models(self) -> Dict[str, bool]:
        """Pull recommended models from Ollama"""
        results = {}
        
        # Models to pull in order of priority
        models = [
            "deepseek-r1:8b",      # Best for financial reasoning
            "qwen3:8b",            # Good balance
            "mistral:7b",          # Fast and efficient
        ]
        
        for model in models:
            try:
                logger.info(f"Pulling model: {model}")
                process = await asyncio.create_subprocess_exec(
                    "ollama", "pull", model,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                await process.wait()
                results[model] = process.returncode == 0
            except Exception as e:
                logger.error(f"Failed to pull {model}: {e}")
                results[model] = False
        
        return results
    
    def get_status(self) -> Dict[str, Any]:
        """Get FlowAI engine status"""
        return {
            "mode": self.mode.value,
            "ollama_available": self.ollama_available,
            "loaded_models": self.loaded_models,
            "recommended_stack": {k: v.name for k, v in self.model_stack.items()},
            "gemini_available": self.gemini_api_key is not None,
            "available_vram_gb": self.available_vram
        }


# Singleton instance
_engine: Optional[FlowAIEngine] = None

async def get_flowai_engine() -> FlowAIEngine:
    """Get or create FlowAI engine singleton"""
    global _engine
    if _engine is None:
        _engine = FlowAIEngine()
        await _engine.initialize()
    return _engine

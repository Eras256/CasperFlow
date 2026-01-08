"""
FlowAI Model Registry
Defines available local LLM models for different tasks

Best Models for Financial Analysis (January 2026):
- DeepSeek-R1: Best for mathematical reasoning and quantitative analysis
- Qwen3: Excellent for complex financial calculations
- Llama 3.2 Vision: Best for OCR and invoice parsing
- Mistral/Mixtral: Efficient general-purpose reasoning
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional, List, Dict

class ModelCapability(Enum):
    """Capabilities of AI models"""
    MATHEMATICAL_REASONING = "mathematical_reasoning"
    FINANCIAL_ANALYSIS = "financial_analysis"
    QUANTITATIVE = "quantitative"
    OCR_VISION = "ocr_vision"
    CODE_GENERATION = "code_generation"
    RISK_ASSESSMENT = "risk_assessment"
    DOCUMENT_PARSING = "document_parsing"

@dataclass
class AIModel:
    """Definition of an AI model"""
    name: str
    ollama_name: str
    parameters: str
    context_length: int
    capabilities: List[ModelCapability]
    description: str
    priority: int  # Lower = higher priority
    requires_gpu: bool = True
    min_vram_gb: float = 8.0

class ModelRegistry:
    """
    Registry of best local AI models for FlowAI
    Based on January 2026 benchmarks and research
    """
    
    # Tier 1: Top-tier models for complex reasoning (Opus/Gemini 3 Pro level)
    DEEPSEEK_R1 = AIModel(
        name="DeepSeek-R1",
        ollama_name="deepseek-r1:14b",
        parameters="14B",
        context_length=128000,
        capabilities=[
            ModelCapability.MATHEMATICAL_REASONING,
            ModelCapability.FINANCIAL_ANALYSIS,
            ModelCapability.QUANTITATIVE,
            ModelCapability.RISK_ASSESSMENT,
        ],
        description="State-of-the-art mathematical reasoning model. Achieves near-perfect scores on AIME and advanced math benchmarks.",
        priority=1,
        requires_gpu=True,
        min_vram_gb=12.0
    )
    
    QWEN3_32B = AIModel(
        name="Qwen3-32B",
        ollama_name="qwen3:32b",
        parameters="32B",
        context_length=131072,
        capabilities=[
            ModelCapability.MATHEMATICAL_REASONING,
            ModelCapability.FINANCIAL_ANALYSIS,
            ModelCapability.QUANTITATIVE,
            ModelCapability.CODE_GENERATION,
        ],
        description="Alibaba's Qwen3 with thinking mode for step-by-step complex problem solving. Perfect score on AIME 2024.",
        priority=1,
        requires_gpu=True,
        min_vram_gb=24.0
    )
    
    # Tier 2: Efficient high-performance models
    DEEPSEEK_R1_8B = AIModel(
        name="DeepSeek-R1-8B",
        ollama_name="deepseek-r1:8b",
        parameters="8B",
        context_length=128000,
        capabilities=[
            ModelCapability.MATHEMATICAL_REASONING,
            ModelCapability.FINANCIAL_ANALYSIS,
            ModelCapability.QUANTITATIVE,
        ],
        description="Compact version of DeepSeek-R1. Excellent for financial document analysis on consumer hardware.",
        priority=2,
        requires_gpu=True,
        min_vram_gb=8.0
    )
    
    QWEN3_14B = AIModel(
        name="Qwen3-14B",
        ollama_name="qwen3:14b",
        parameters="14B",
        context_length=131072,
        capabilities=[
            ModelCapability.MATHEMATICAL_REASONING,
            ModelCapability.FINANCIAL_ANALYSIS,
            ModelCapability.QUANTITATIVE,
        ],
        description="Balanced Qwen3 model with strong quantitative capabilities.",
        priority=2,
        requires_gpu=True,
        min_vram_gb=12.0
    )
    
    LLAMA_3_2_VISION = AIModel(
        name="Llama-3.2-Vision",
        ollama_name="llama3.2-vision:11b",
        parameters="11B",
        context_length=128000,
        capabilities=[
            ModelCapability.OCR_VISION,
            ModelCapability.DOCUMENT_PARSING,
            ModelCapability.FINANCIAL_ANALYSIS,
        ],
        description="Best for invoice and receipt OCR. Extracts structured data from images.",
        priority=1,
        requires_gpu=True,
        min_vram_gb=10.0
    )
    
    # Tier 3: Fast and efficient models
    MISTRAL_7B = AIModel(
        name="Mistral-7B",
        ollama_name="mistral:7b",
        parameters="7B",
        context_length=32768,
        capabilities=[
            ModelCapability.FINANCIAL_ANALYSIS,
            ModelCapability.CODE_GENERATION,
            ModelCapability.RISK_ASSESSMENT,
        ],
        description="Fast and efficient general-purpose model. Great for quick analysis.",
        priority=3,
        requires_gpu=False,
        min_vram_gb=6.0
    )
    
    PHI_3_5 = AIModel(
        name="Phi-3.5",
        ollama_name="phi3.5:3.8b",
        parameters="3.8B",
        context_length=128000,
        capabilities=[
            ModelCapability.FINANCIAL_ANALYSIS,
            ModelCapability.DOCUMENT_PARSING,
        ],
        description="Microsoft's lightweight model. Excellent for high-accuracy financial categorization.",
        priority=3,
        requires_gpu=False,
        min_vram_gb=4.0
    )
    
    # Fallback: Smallest model for CPU-only
    QWEN3_0_6B = AIModel(
        name="Qwen3-0.6B",
        ollama_name="qwen3:0.6b",
        parameters="0.6B",
        context_length=32768,
        capabilities=[
            ModelCapability.FINANCIAL_ANALYSIS,
        ],
        description="Ultra-lightweight model for CPU-only inference. Basic financial analysis.",
        priority=4,
        requires_gpu=False,
        min_vram_gb=1.0
    )
    
    @classmethod
    def get_all_models(cls) -> List[AIModel]:
        """Get all registered models"""
        return [
            cls.DEEPSEEK_R1,
            cls.QWEN3_32B,
            cls.DEEPSEEK_R1_8B,
            cls.QWEN3_14B,
            cls.LLAMA_3_2_VISION,
            cls.MISTRAL_7B,
            cls.PHI_3_5,
            cls.QWEN3_0_6B,
        ]
    
    @classmethod
    def get_models_by_capability(cls, capability: ModelCapability) -> List[AIModel]:
        """Get models that have a specific capability"""
        return [
            model for model in cls.get_all_models()
            if capability in model.capabilities
        ]
    
    @classmethod
    def get_best_model_for_task(cls, task: ModelCapability, max_vram: float = 24.0) -> Optional[AIModel]:
        """Get the best model for a specific task that fits in available VRAM"""
        suitable_models = [
            model for model in cls.get_models_by_capability(task)
            if model.min_vram_gb <= max_vram
        ]
        if suitable_models:
            return min(suitable_models, key=lambda m: m.priority)
        return None
    
    @classmethod
    def get_recommended_stack(cls, available_vram: float = 12.0) -> Dict[str, AIModel]:
        """Get recommended model stack based on available VRAM"""
        stack = {}
        
        # Math/Quantitative
        math_model = cls.get_best_model_for_task(ModelCapability.MATHEMATICAL_REASONING, available_vram)
        if math_model:
            stack["mathematical"] = math_model
        
        # Financial Analysis
        finance_model = cls.get_best_model_for_task(ModelCapability.FINANCIAL_ANALYSIS, available_vram)
        if finance_model and finance_model != math_model:
            stack["financial"] = finance_model
        
        # Vision/OCR
        vision_model = cls.get_best_model_for_task(ModelCapability.OCR_VISION, available_vram)
        if vision_model:
            stack["vision"] = vision_model
        
        # Risk Assessment
        risk_model = cls.get_best_model_for_task(ModelCapability.RISK_ASSESSMENT, available_vram)
        if risk_model and risk_model not in stack.values():
            stack["risk"] = risk_model
        
        return stack

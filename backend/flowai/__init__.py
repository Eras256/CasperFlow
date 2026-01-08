# FlowAI - Local AI System for FlowFi
# Multi-model architecture for financial analysis

from .engine import FlowAIEngine, AnalysisMode, AnalysisResult
from .models import ModelRegistry, ModelCapability
from .core import FlowAICore, get_flowai_core, RiskAssessment, RiskGrade

__version__ = "1.0.0"
__all__ = [
    "FlowAIEngine",
    "AnalysisMode", 
    "AnalysisResult",
    "ModelRegistry",
    "ModelCapability",
    "FlowAICore",
    "get_flowai_core",
    "RiskAssessment",
    "RiskGrade",
]


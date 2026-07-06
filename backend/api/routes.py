import time
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any, List

from backend.services.gemini import GeminiService

router = APIRouter()

# Define request schema
class RewriteRequest(BaseModel):
    text: str = Field(..., description="The original text to rewrite")
    tone: str = Field(..., description="The target writing tone")

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        v_stripped = v.strip()
        if not v_stripped:
            raise ValueError("Input text cannot be empty.")
        if len(v_stripped) > 5000:
            raise ValueError("Input text exceeds the maximum character limit of 5000.")
        return v_stripped

    @field_validator("tone")
    @classmethod
    def validate_tone(cls, v: str) -> str:
        valid_tones = ["Formal", "Casual", "Professional", "Friendly", "Child-Friendly", "Academic"]
        if v not in valid_tones:
            raise ValueError(f"Invalid tone selected. Must be one of: {', '.join(valid_tones)}")
        return v

# Define response schema
class RewriteResponse(BaseModel):
    original: str
    rewrite: str
    back_translation: str
    analysis: Dict[str, Any]
    execution_time_ms: float

@router.post("/rewrite", response_model=RewriteResponse, status_code=status.HTTP_200_OK)
async def rewrite_text_endpoint(request: RewriteRequest):
    """
    Main endpoint for ToneShift.
    Orchestrates:
    1. Text rewriting into the target tone.
    2. Back-translation into simple neutral English.
    3. Similarity/meaning-preservation analysis using structured output.
    """
    start_time = time.time()
    try:
        # Initialize Gemini service
        gemini_service = GeminiService()
        
        # Step 1: Rewrite Text
        rewritten_text = gemini_service.rewrite_text(request.text, request.tone)
        
        # Step 2: Back Translate
        back_translation = gemini_service.back_translate(rewritten_text)
        
        # Step 3: Evaluate Meaning
        analysis = gemini_service.evaluate_quality(request.text, back_translation)
        
        # Measure time taken
        execution_time_ms = round((time.time() - start_time) * 1000, 2)
        
        return RewriteResponse(
            original=request.text,
            rewrite=rewritten_text,
            back_translation=back_translation,
            analysis=analysis,
            execution_time_ms=execution_time_ms
        )
        
    except ValueError as e:
        # Handle configuration or validation errors (e.g. missing API key)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Handle general Gemini API or network failures
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during rewrite processing: {str(e)}"
        )

import os
import json
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

from backend.utils.config import settings
from backend.services.prompts import REWRITE_PROMPT, BACK_TRANSLATION_PROMPT, EVALUATION_PROMPT

# Pydantic schema for structured output of quality analysis
class QualityAnalysis(BaseModel):
    meaning_preserved: bool = Field(
        description="Whether the core meaning has been preserved between original and back translation (true/false)"
    )
    similarity_score: int = Field(
        description="A score from 0 to 100 representing how closely the back-translated text matches the meaning of the original text"
    )
    drift_level: str = Field(
        description="The level of semantic meaning drift. Must be 'Low', 'Medium', or 'High'"
    )
    summary: str = Field(
        description="A brief summary of the semantic alignment or differences"
    )
    changed_information: List[str] = Field(
        description="Any specific items of information or facts that were introduced, altered, or lost during rewriting"
    )
    what_changed: List[str] = Field(
        description="3 to 5 clear bullet points explaining: 1) Vocabulary changes, 2) Tone changes, 3) Sentence structure changes, 4) Whether meaning was preserved"
    )

class GeminiService:
    def __init__(self):
        # Determine the API key
        api_key = None
        if settings and settings.gemini_api_key:
            api_key = settings.gemini_api_key
        else:
            api_key = os.environ.get("GEMINI_API_KEY")
            
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY environment variable is missing. "
                "Please set it in your .env file or environment."
            )
        
        # Initialize Google GenAI client
        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.5-flash"

    def rewrite_text(self, text: str, tone: str) -> str:
        """
        Rewrites the input text into a target tone using Gemini.
        """
        prompt = REWRITE_PROMPT.format(selected_tone=tone, user_text=text)
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        
        if not response.text:
            raise RuntimeError("Gemini failed to generate rewritten text.")
            
        return response.text.strip()

    def back_translate(self, rewritten_text: str) -> str:
        """
        Translates the rewritten text back into simple neutral English.
        """
        prompt = BACK_TRANSLATION_PROMPT.format(rewritten_text=rewritten_text)
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )
        
        if not response.text:
            raise RuntimeError("Gemini failed to generate back-translation.")
            
        return response.text.strip()

    def evaluate_quality(self, original_text: str, back_translation: str) -> Dict[str, Any]:
        """
        Evaluates the quality of meaning preservation by comparing original and back-translated texts.
        Returns a structured JSON payload matching the QualityAnalysis schema.
        """
        prompt = EVALUATION_PROMPT.format(
            original_text=original_text,
            back_translation=back_translation
        )
        
        # Use Structured Outputs to ensure perfect JSON response
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=QualityAnalysis,
                temperature=0.1,  # Low temperature for analytical consistency
            )
        )
        
        if not response.text:
            raise RuntimeError("Gemini failed to generate quality analysis.")
            
        try:
            # Parse response text back into a standard Python dictionary
            return json.loads(response.text.strip())
        except json.JSONDecodeError as e:
            # Fallback parsing in case JSON is somehow invalid
            raise RuntimeError(f"Failed to parse Gemini quality evaluation JSON: {e}. Output was: {response.text}")

# Gemini Prompts for ToneShift

# 1. Rewrite Prompt
# Converts the original text to the target tone while preserving meaning and length.
REWRITE_PROMPT = """You are an expert writing assistant.

Rewrite the following text into a {selected_tone} tone.

Requirements:
1. Preserve the original meaning.
2. Do not add new facts.
3. Do not remove important information.
4. Change vocabulary, sentence structure and style only.
5. Keep approximately the same length.
6. Return only the rewritten text.

Text:
{user_text}"""

# 2. Back Translation Prompt
# Translates the rewritten text back to neutral simple English for meaning preservation checks.
BACK_TRANSLATION_PROMPT = """Convert the following text back into simple neutral English while preserving the exact meaning.

Return only the converted text.

Text:
{rewritten_text}"""

# 3. Meaning Evaluation and Change Log Prompt
# Compares original and back-translation to output a structured JSON analysis of meaning preservation and style shifts.
EVALUATION_PROMPT = """Compare these two texts.

Original:
{original_text}

Back Translation:
{back_translation}

Evaluate whether the meaning has been preserved.
In addition, provide 3 to 5 clear bullet points explaining:
- Vocabulary changes
- Tone changes
- Sentence structure changes
- Whether the meaning changed

You must return JSON only. Use the following structure:
{{
  "meaning_preserved": true,
  "similarity_score": 95,
  "drift_level": "Low",
  "summary": "Meaning preserved with only stylistic changes.",
  "changed_information": [],
  "what_changed": [
    "List vocabulary changes here.",
    "List tone changes here.",
    "List sentence structure changes here.",
    "List meaning changes (if any) here."
  ]
}}"""

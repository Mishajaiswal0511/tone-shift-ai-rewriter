# ToneShift – Audience-Aware Rewriter

## Overview

ToneShift uses Google Gemini (Gemini 2.5 Flash) to:
- **Rewrite text into different tones**: Converts a user's text to a target style (Formal, Casual, Professional, Friendly, Child-Friendly, or Academic) while adapting the language dynamically.
- **Preserve the original meaning**: Enforces strict instructions preventing the addition or deletion of key facts and information.
- **Perform back-translation**: Re-translates the rewritten text back into plain, simple, neutral English as a crucial validation step.
- **Evaluate semantic similarity and meaning drift**: Conducts a structured comparative analysis of the original text and its back-translation to quantify similarity and pinpoint style changes.

---

# Workflow

```text
User Input
    ↓
Tone Selection
    ↓
Gemini Rewrite (Prompt 1)
    ↓
Back Translation (Prompt 2)
    ↓
Meaning Evaluation (Prompt 3)
    ↓
Quality Analysis (JSON output parsing)
    ↓
Final Output (Side-by-side Diff View & Analysis Cards)
```

---

# Prompt 1 – Tone Rewriting

### Purpose
To rewrite the user's input text into the requested writing tone while strictly preserving length, context, and core facts. 

### Template
```text
You are an expert writing assistant.

Rewrite the following text into a {selected_tone} tone.

Requirements:
1. Preserve the original meaning.
2. Do not add new facts.
3. Do not remove important information.
4. Change vocabulary, sentence structure and style only.
5. Keep approximately the same length.
6. Return only the rewritten text.

Text:
{user_text}
```

---

# Prompt 2 – Back Translation

### Purpose
To convert the stylized, rewritten text back into simple, neutral English. This removes any tone-specific vocabulary and sentence structures, leaving a flat version of the text that can be directly compared against the original.

### Template
```text
Convert the following text back into simple neutral English while preserving the exact meaning.

Return only the converted text.

Text:
{rewritten_text}
```

---

# Prompt 3 – Meaning Evaluation

### Purpose
To perform a side-by-side semantic comparison between the **Original Text** and the **Back-Translated Text** (the neutral version). Since both texts are in plain English, Gemini can objectively calculate meaning preservation, identify drift, and explain exact stylistic modifications.

### Expected JSON Response Structure
The model returns a structured JSON payload matching this Pydantic schema:
```json
{
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
}
```

### Template
```text
Compare these two texts.

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
}}
```

---

# Prompt Engineering Decisions

* **Importance of Prompt Engineering**: Enforces strict operational boundaries on large language models (LLMs). Without strict prompt systemization, LLMs are prone to hallucinating facts, expanding text length unnecessarily, or injecting external knowledge during rewrites.
* **Low Temperature for Consistency**: We configure the Meaning Evaluation step with a low temperature (`temperature=0.1`). This minimizes creative variation, forcing the model to act as a highly logical and consistent semantic auditor.
* **Meaning Preservation Priority**: In business and academic settings, rewriting text for different audiences must never compromise the underlying integrity of the message. Our prompts prioritize this constraint above all else.
* **Back-Translation as a Validation Step**: Standard text comparison algorithms (like cosine similarity of embeddings) are highly sensitive to vocabulary shifts. By using back-translation, we translate the text back into a neutral style, neutralizing the vocabulary change. This lets Gemini compare the core semantic message rather than the style.
* **Structured JSON Responses over Plain Text**: Plain text responses from AI models are notoriously difficult to parse consistently in production. By defining a Pydantic schema and requesting `response_mime_type="application/json"`, we guarantee structured JSON output. This lets the backend parse scores, drift levels, and bullet points directly into the API response without regular expression matching.

---

# AI Workflow

The complete processing pipeline in ToneShift:

1. **User enters text**: The user pastes their original content (up to 5000 characters).
2. **User selects a tone**: The user chooses one of the six tone options (Formal, Casual, Professional, Friendly, Child-Friendly, or Academic).
3. **Gemini rewrites the text**: The backend sends the text to the model using **Prompt 1** to generate the styled rewrite.
4. **Gemini performs back-translation**: The rewritten output is sent back to the model using **Prompt 2** to generate a neutral English back-translation.
5. **Gemini evaluates semantic similarity**: The original text and back-translation are sent to the model using **Prompt 3** with a defined Pydantic JSON schema.
6. **The application displays the output**: The React frontend receives the full response and displays:
   * **Original Text**
   * **Rewritten Text**
   * **Back Translation**
   * **Quality Analysis** (Meaning Preserved, Similarity Score, Drift Level, AI Summary, and "What Changed?" explanations)

---

# Future Improvements

* **Additional Tones**: Introduce specialized options such as *Humorous*, *Sarcastic*, *Poetic*, or *Marketing Copy*.
* **Multi-Language Support**: Enable tone rewriting and back-translation across Spanish, French, German, and other major world languages.
* **PDF/DOCX Export**: Add direct document download formats alongside plain text exports.
* **Readability Analysis**: Calculate Flesch-Kincaid grade levels for the original and rewritten texts to show the educational level of the rewrite.
* **Grammar Suggestions**: Highlight structural issues in the original text and suggest grammatical fixes before rewriting.
* **User History**: Persist past rewrites in the browser using IndexedDB or local storage so users can revisit previous comparisons.
* **Batch Rewriting**: Allow users to upload files and rewrite multiple passages in bulk.

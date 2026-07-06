import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # This will load GEMINI_API_KEY from environment or .env file
    gemini_api_key: str
    
    # Backend host and port settings
    host: str = "127.0.0.1"
    port: int = 8000
    
    # Configure Pydantic to read from the root .env file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate settings to be imported by other files
# Note: If gemini_api_key is not found, Pydantic will raise validation error.
try:
    settings = Settings()
except Exception as e:
    # During startup or build step, if key is not set, we can allow fallback/lazy loading
    # or print a clear warning. We'll raise it so the app fails fast if configured wrong,
    # but let's provide a friendly fallback if it's missing during installation/tests.
    import sys
    print(f"Error loading configuration: {e}", file=sys.stderr)
    print("Please ensure GEMINI_API_KEY is defined in a .env file at the project root or in environment variables.", file=sys.stderr)
    # Default settings with empty key for placeholder import checks (will fail on actual API call)
    settings = None

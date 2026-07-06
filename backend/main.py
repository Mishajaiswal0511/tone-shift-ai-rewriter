import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router as api_router
from utils.config import settings

app = FastAPI(
    title="ToneShift API",
    description="Backend API for ToneShift - Audience-Aware AI Rewriter",
    version="1.0.0"
)

# Set up CORS middleware to allow communication from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development; narrow this down in production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the ToneShift Backend API. Use POST /api/rewrite to change text tone."
    }

if __name__ == "__main__":
    # Standard local startup runner
    host = settings.host if settings else "127.0.0.1"
    port = settings.port if settings else 8000
    uvicorn.run("main:app", host=host, port=port, reload=True)

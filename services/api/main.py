from fastapi import FastAPI
from .routers import health, auth, analysis, ollama

app = FastAPI()

app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(ollama.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"Hello": "World"}

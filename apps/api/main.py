from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import auth
import routers_sources

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Tracker")

# Allow all origins for the MVP development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(routers_sources.router)

@app.get("/")
def read_root():
    return {"status": "ok", "service": "api"}

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import save_user, user_exists
from pydantic import BaseModel
from encrypt import hash_password, check_password

class UserSignup(BaseModel):
    email: str
    password: str

# App object
app = FastAPI()

# Allowed origins for CORS
origins = ["https://localhost:3000", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"HI!!!! o/"}

@app.post("/api/signup")
async def signup(user: UserSignup):
    # Check if the user already exists
    if user_exists(user.email):
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash the user's password
    hashed_password = hash_password(user.password)

    # Save the user to the database
    save_user(user.email, hashed_password)

    return {"message": "User created successfully"}
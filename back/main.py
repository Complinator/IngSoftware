from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import save_user, user_exists
from pydantic import BaseModel
from encrypt import hash_password, check_password
import os
from models.chatai import chatAI
from models.pdf import readPDF
from models.model import Request
from helpers.utils import getCurrdir, getRelative
from dotenv import load_dotenv, find_dotenv, set_key

__location__ = getCurrdir() # Current directory (.../back)

env = os.getenv("ENVIRONMENT", "local")
load_dotenv(dotenv_path=getRelative(f".env.{env}"))

api_key = os.getenv("API_KEY")
assistant_id = os.getenv("ASSISTANT_ID")
dotenvpath = find_dotenv(".env.local")


class UserSignup(BaseModel):
    email: str
    password: str

# App object
app = FastAPI()
chatai = chatAI(api_key)
readpdf = readPDF(getRelative("LuquilloWMS.pdf"))

# Creating/Loading ai

if assistant_id == None:
    chatai.generatePrompt(readpdf.items)
    set_key(dotenvpath, "ASSISTANT_ID", chatai.createAssistant(readpdf.items["Nombre"]))
    print("Creating...")

else:
    chatai.loadAssisant(assistant_id)
    print("Loading...")

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
def readRoot():
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

@app.get("/test")
def test():
    print(readpdf.text)
    print(getRelative("../modules"))

@app.get("/chat") # From the frontend: if not threadid JWT, then get
def loadChat(): # This must be triggered in the front, the user must open the chat for it to create the thread, not before
    return {chatai.createThread()} # This must be passed via JWT

@app.post("/chat")
def getResponse(request : Request):
    chatai.createMessage(request.message, request.threadid)
    response = chatai.retrieveAssistant(chatai.runAssistant(request.threadid), request.threadid)
    return response
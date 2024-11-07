from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from database import save_user, user_exists, get_all_users, get_user_by_email, save_conversation
from pydantic import BaseModel
from encrypt import hash_password, check_password
from models.chatai import chatAI
from models.pdf import readPDF
from models.model import Request, User
from helpers.utils import getCurrdir, getRelative
from dotenv import load_dotenv, find_dotenv, set_key
from datetime import timedelta
import os

__location__ = getCurrdir() # Current directory (.../back)

env = os.getenv("ENVIRONMENT", "local")
load_dotenv(dotenv_path=getRelative(f".env.{env}"))
api_key = os.getenv("API_KEY")
assistant_id = os.getenv("ASSISTANT_ID")
dotenvpath = find_dotenv(".env.local")

# App object
app = FastAPI()

# Allowed origins for CORS
origins = ["http://localhost:3000", "https://localhost:3000", "http://localhost:8000", "https://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Creating/Loading ai
chatai = chatAI(api_key)
readpdf = readPDF(getRelative("documents/LuquilloWMS.pdf"))

if assistant_id == None:
    chatai.generatePrompt(readpdf.items)
    set_key(dotenvpath, "ASSISTANT_ID", chatai.createAssistant(readpdf.items["Nombre"]))
    print("Creating...")

documents_folder = getRelative("documents")
if not os.path.exists(documents_folder):
    os.makedirs(documents_folder)


class Settings(BaseModel):
    # Despues poner esto en .env.local y llamarlo con:
    # authjwt_secret_key = os.getenv("SECRET_KEY")
    authjwt_secret_key: str = "venjamin123"
    authjwt_access_token_expires: timedelta = timedelta(minutes=5)  # Access token expiry
    authjwt_refresh_token_expires: timedelta = timedelta(days=7)  # Refresh token expiry


@AuthJWT.load_config
def get_config():
    return Settings()

@app.get("/")
def readRoot():
    return {"HI!!!! o/"}

@app.post('/auth/refresh')
def refresh_token(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_refresh_token_required()
        current_user = Authorize.get_jwt_subject()
        new_access_token = Authorize.create_access_token(subject=current_user)
        return {"access_token": new_access_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
@app.post("/auth/signup")
async def signup(user: User):
    if user_exists(user.email):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(user.password)
    save_user(user.email, hashed_password)
    return {"message": "User created successfully"}

@app.post("/auth/login")
async def login(user: User, Authorize: AuthJWT = Depends()):
    db_user = get_user_by_email(user.email)
    if not db_user or not check_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    access_token = Authorize.create_access_token(subject=db_user["email"])
    refresh_token = Authorize.create_refresh_token(subject=db_user["email"]) 
    return {'access_token': access_token, 'refresh_token': refresh_token}

@app.post("/auth/verify-token")
def verify_token(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required() 
        user_identity = Authorize.get_jwt_subject()  # Get subject (identity) from token
        return {"isValid": True, "user": user_identity}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# Route to get all users
@app.get("/api/users")
async def get_users(Authorize: AuthJWT = Depends()):
    
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()

    if current_user != "admin@admin.com":
        raise HTTPException(status_code=403, detail="Not authorized")

    users = get_all_users()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")

    return {"users": users}

@app.get("/api/files")
async def get_files():
    documents_path = getRelative("documents")
    try:
        files = os.listdir(documents_path)
        return {"files": files}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Documents folder not found")

@app.get("/test")
def test():
    print(readpdf.text)
    print(getRelative("../modules"))

@app.get("/chat") # From the frontend: if not threadid JWT, then get
def loadChat(): # This must be triggered in the front, the user must open the chat for it to create the thread, not before
    thread_id = chatai.createThread()
    return {"threadid": thread_id}  # Asegúrate de devolver un diccionario con clave "threadid"

@app.post("/chat")
async def getResponse(request: Request): #Authorize: AuthJWT = Depends()
    # current_user = Authorize.get_jwt_subject()
    message_id = chatai.createMessage(request.message, request.threadid)
    run_id = chatai.runAssistant(request.threadid, request.assistantid)
    response = chatai.retrieveAssistant(run_id, request.threadid)
    conversation = chatai.retrieveMessages(request.threadid)
    save_conversation(thread_id=request.threadid, messages=conversation)

    return {"response": response}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_location = getRelative(f"documents/{file.filename}")
    with open(file_location, "wb") as f:
        f.write(await file.read())

    readpdf = readPDF(file_location)
    chatai.createAssistant(file.filename.replace(".pdf", ""), chatai.generatePrompt(readpdf.items))
    return {"info": f"Assistant created successfully'"}

class SubmitFilesRequest(BaseModel):
    files: list[str]


@app.post("/api/submit-files")
async def submit_files(request: SubmitFilesRequest):
    documents_path = getRelative("documents")
    processed_files = []
    for file_name in request.files:
        file_path = os.path.join(documents_path, file_name)
        if os.path.exists(file_path):
            processed_content = readPDF(file_path).readPDF()
            processed_files.append({"file": file_name, "content": processed_content})
        else:
            raise HTTPException(status_code=404, detail=f"File '{file_name}' not found")
    return JSONResponse(content={"processed_files": processed_files})

@app.get("/assistants")
async def getAssistants():
    return chatai.listAssistant()

class DeleteAssistantRequest(BaseModel):
    assistantid: str

@app.post("/api/delete-assistant")
async def delete_assistant(request : DeleteAssistantRequest):
    chatai.removeAssistant(request.assistantid)
    return {"message": "Assistant deleted successfully"}

class CreateAssistantRequest(BaseModel):
    name: str

@app.post("/api/create-assistant")
async def create_assistant(request: CreateAssistantRequest):
    chatai.createAssistant(request.name)
    return {"message": "Assistant created successfully"}

class LoadAssistantRequest(BaseModel):
    assistant_id: str

@app.post("/api/load-assistant")
async def load_assistant(request: LoadAssistantRequest):
    chatai.loadAssistant(request.assistant_id)
    return {"assistant_id": chatai.assistant.id, "assistant_name": chatai.assistant.name}

@app.get("/api/current-assistant")
async def current_assistant():
    return {"assistant_id": chatai.assistant.id}


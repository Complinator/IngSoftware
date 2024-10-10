from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv, set_key
from helpers.utils import getCurrdir, getRelative
import os

__location__ = getCurrdir() # Current directory (.../back)

env = os.getenv("ENVIRONMENT", "local")
load_dotenv(dotenv_path=getRelative(f".env.{env}"))
uri = os.getenv("MONGODB_URI")

client = MongoClient(uri)
db = client["MainDatabase"]
users_collection = db["usuarios"]

# Check if a user already exists by email
def user_exists(email: str) -> bool:
    return users_collection.find_one({"email": email}) is not None

# Save user to the database
def save_user(email: str, hashed_password: bytes):
    user_document = {
        "email": email,
        "password": hashed_password,
    }
    users_collection.insert_one(user_document)

# Get all users from the collection
def get_all_users():
    users_cursor = users_collection.find({}, {"_id": 0})  
    return list(users_cursor)

# Find user by email
def find_user_by_email(email: str):
    return users_collection.find_one({"email": email})
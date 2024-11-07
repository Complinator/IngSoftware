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


def get_user_by_email(email: str):
    user = users_collection.find_one({"email": email})
    return user
def save_conversation(thread_id: str, messages: list):
    print(f"Checking for existing thread with ID: {thread_id}")
    thread = db["conversaciones"].find_one({"thread_id": thread_id})
    
    if thread is None:
        print(f"No existing thread found. Creating new conversation document for thread ID: {thread_id}")
        conversation_document = {
            "thread_id": thread_id,
            "messages": messages,
        }
        db["conversaciones"].insert_one(conversation_document)
        print(f"New conversation document inserted for thread ID: {thread_id}")
    else:
        print(f"Existing thread found for thread ID: {thread_id}. Checking for new messages.")
        existing_message_ids = {msg["id"] for msg in thread["messages"]}
        new_messages = [msg for msg in messages if msg["id"] not in existing_message_ids]
        
        if new_messages:
            print(f"New messages found. Updating conversation document for thread ID: {thread_id}")
            db["conversaciones"].update_one(
                {"thread_id": thread_id},
                {"$push": {"messages": {"$each": new_messages}}}
            )
            print(f"Conversation document updated for thread ID: {thread_id}")
        else:
            print(f"No new messages to add for thread ID: {thread_id}")

    print(f"Checking for existing thread with ID: {thread_id}")
    thread = db["conversaciones"].find_one({"thread_id": thread_id})
    
    if thread is None:
        print(f"No existing thread found. Creating new conversation document for thread ID: {thread_id}")
        conversation_document = {
            "thread_id": thread_id,
            "messages": messages,
        }
        db["conversaciones"].insert_one(conversation_document)
        
        print(f"New conversation document inserted for thread ID: {thread_id}")
    else:
        print(f"Existing thread found for thread ID: {thread_id}. Checking for new messages.")
        existing_message_ids = {msg["id"] for msg in thread["messages"]}
        new_messages = [msg for msg in messages if msg["id"] not in existing_message_ids]
        
        if new_messages:
            print(f"New messages found. Updating conversation document for thread ID: {thread_id}")
            db["conversaciones"].update_one(
                {"thread_id": thread_id},
                {"$push": {"messages": {"$each": new_messages}}}
            )
            print(f"Conversation document updated for thread ID: {thread_id}")
        else:
            print(f"No new messages to add for thread ID: {thread_id}")
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]
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

import bcrypt

def hash_password(password: str) -> bytes:
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()  # You can also specify the rounds (e.g., bcrypt.gensalt(12))
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

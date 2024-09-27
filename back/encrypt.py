import bcrypt

def hash_password(password: str) -> bytes:
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def check_password(input_password: str, stored_password: bytes) -> bool:
    # Check if the hashed password is the same
    return bcrypt.checkpw(input_password.encode('utf-8'), stored_password)

import bcrypt

def hash_password(password: str) -> bytes:
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def check_password(input_password: str, hashed_password: str) -> bool:
    # Convert the hashed password (which is stored as a string) to bytes
    hashed_password_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password_bytes)

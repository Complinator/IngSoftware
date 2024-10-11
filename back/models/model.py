from pydantic import BaseModel

class Request(BaseModel):
    threadid: str
    message: str
    assistantid: str

class User(BaseModel):
    email: str
    password: str

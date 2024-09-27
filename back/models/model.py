from pydantic import BaseModel

class Request(BaseModel):
    threadid: str
    message: str
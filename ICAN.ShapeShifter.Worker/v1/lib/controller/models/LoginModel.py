from pydantic import BaseModel

class LoginModel(BaseModel):
    loginId: str
    password: str
    
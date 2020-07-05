from typing import Optional

from fastapi import FastAPI, status, Response
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.wsgi import WSGIMiddleware

import requests

from v1.lib.controller.speech_lib.asr_service_lib import app

from v1.lib.controller.models.LoginModel import *


mainApp = FastAPI()

mainApp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None


@mainApp.get("/")
def read_root(response: Response):
    response.status_code = 302
    response.headers["Location"] = "static/index.html"
    return response

@mainApp.post("/v1/login")
def read_login(loginData: LoginModel):
    authResponse = requests.post('http://127.0.0.1:8001/login', json={
        "loginId": loginData.loginId, "password": loginData.password}).json()
    return authResponse

mainApp.mount("/static", StaticFiles(directory="static"), name="static")

@mainApp.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}


@mainApp.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}

mainApp.mount("/v1", WSGIMiddleware(app))


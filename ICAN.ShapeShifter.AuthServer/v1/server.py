from japronto import Application
import uuid
from concurrent.futures import ThreadPoolExecutor
import sys

loginToTokenMap = {}
tokenToLoginIdMap = {}
authMap = {
    "cppxaxa": "abc"
}
executor = ThreadPoolExecutor(max_workers=256)

def authenticate(loginId, password, authMap):
    return loginId in authMap and authMap[loginId] == password

def createToken():
    return str(uuid.uuid1())

async def hello(request):
    return request.Response(text='Hello world! Im authenticating server')

def loginTokenProcess(token, loginId, loginToTokenMap, tokenToLoginIdMap):
    if loginId in loginToTokenMap: 
        del tokenToLoginIdMap[loginToTokenMap[loginId]]
    loginToTokenMap[loginId] = token
    tokenToLoginIdMap[token] = loginId

async def login(request):
    global loginToTokenMap, tokenToLoginIdMap, authMap, executor
    data = request.json
    loginId = data["loginId"]
    password = data["password"]
    if authenticate(loginId, password, authMap):
        token = createToken()
        executor.submit(lambda: loginTokenProcess(token, loginId, loginToTokenMap, tokenToLoginIdMap))
        return request.Response(json={ "token": token })
    return request.Response(json='Rejected', code=401)

async def next(request):
    global loginToTokenMap, tokenToLoginIdMap, authMap, executor
    token = request.json["token"]
    if not token in tokenToLoginIdMap: 
        return request.Response(json=["TokenExpired", "TokenTampered", "InvalidToken"], code=401)
    loginId = tokenToLoginIdMap[token]
    if loginToTokenMap[loginId] != token:
        return request.Response(json=["MiddlemanPresent", "MightBeDesignError"], code=401)

    # Fit a reverse proxy

    newToken = createToken()
    executor.submit(lambda: loginTokenProcess(newToken, loginId, loginToTokenMap, tokenToLoginIdMap))
    return request.Response(json={ "token": newToken })


app = Application()
app.router.add_route('/', hello)
app.router.add_route('/login', login)
app.router.add_route('/next', next)
app.run(port=8001)


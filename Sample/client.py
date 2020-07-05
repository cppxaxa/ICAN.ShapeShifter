import requests

r = requests.post('http://127.0.0.1:8001/login', json={
	"loginId": "cppxaxa",
	"password": "abc"
})
print(r.json())

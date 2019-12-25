import requests
import json

API_endpoint = "http://localhost:3000"

# this is for testing only
data = {
    "temperature": 20,
    "moisture": 30,
    "light": 40
}
header = {'content-type': 'application/json'}
request = requests.post(API_endpoint, data=json.dumps(data), headers=header)
print("Data updated!")

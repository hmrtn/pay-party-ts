import requests
import json 
files = {
'example_election_0': '/Users/hans/Documents/pay.party/example_election.json'
}
response = requests.post(
    'https://ipfs.infura.io:5001/api/v0/add', 
    files=files, 
    auth=("21mUD4vDZGi9gc0KxDKeBeVUmoY","a90a0430f21e78adfef6f70151efa30a")
)
print(response.text)

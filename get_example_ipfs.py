import requests
params = (
('arg','Qmb4EN4SrTLJtoXnoY4gTnEdWhfsnGp1GuJEEjMyRxKnac'),
)
response = requests.post(
    'https://ipfs.infura.io:5001/api/v0/cat',
    params=params, 
    auth=("21mUD4vDZGi9gc0KxDKeBeVUmoY","a90a0430f21e78adfef6f70151efa30a"))
print(response.json)


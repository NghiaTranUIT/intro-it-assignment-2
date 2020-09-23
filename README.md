## README
- Smart Garden Project

## NodeJS Server
### Setup
- Install [NodeJS](https://nodejs.org/en/)

### Useage
```bash
## Move to server folder
$ cd server

## Install dependency
$ npm install

## Start a server
$ node index.js

## Open at localhost:3000 on Google Chrome

```

### Endpoint
#### Post Sensor data
- POST /api/sensor
- Header: content-type: application/json
- Body JSON with a following format
```json
{
    "temperature": 20,
    "moisture": 30,
    "light": 40
}
```

#### Example

```bash
curl --request POST \
  --url http://localhost:3000/api/sensor \
  --header 'content-type: application/json' \
  --data '{
    "temperature": 20.232,
    "moisture": 20.123213,
    "light": 50
}'
```

### How to regenerate a Token
1. Delete server/token.json
2. Run
```bash
node index.js
```
3. Copy a link on the terminal and start authorizing
4. Follow the guideline
5. Commit and push
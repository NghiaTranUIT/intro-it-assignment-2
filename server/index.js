const express = require('express')
const app = express()
const port = 3000

// Setup middlewares
app.use(express.json()) 


// Data

const tempRecords = [];
const moistureRecords = [];
const lightRecords = [];

//
app.get('/', (req, res) => res.send('Hello World from Smart Garden!'))


// POST sensor data
app.post('/api/sensor', (req, res) => {
	const body = req.body
	console.log(body)
	processSensorData(body)
	console.log(tempRecords)
  	res.json(req.body)
})

function processSensorData(body) {
	const temp = body.temperature
	const moisture = body.moisture
	const light = body.light
	const timestamp = Date.now()
	const date = new Date().toISOString()
	const record = {
		"timestamp": timestamp,
		"date": date
	}

	if (temp !== undefined) {
		record.value = temp
		tempRecords.push(record)
	}

	if (moisture !== undefined) {
		record.value = moisture
		moistureRecords.push(record)
	}

	if (light !== undefined) {
		record.value = light
		lightRecords.push(record)
	}
}

// Start the server at 3000 port
const server = app.listen(port, function () {
   const host = "localhost"
   const port = server.address().port
   console.log("Smart Garden server is listening at http://%s:%s", host, port)
})
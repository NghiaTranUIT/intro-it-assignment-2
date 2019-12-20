const express = require('express')
const app = express()
const port = 3000

// Setup middlewares
app.use(express.json()) 

// Data
const records = [];

// Greeting
app.get('/', (req, res) => res.send('Hello World from Smart Garden!'))


// POST sensor data
app.post('/api/sensor', (req, res) => {
	const body = req.body

	// Create record
	const status = processSensorData(body)
	console.log(records)

	if (status) {
		res.sendStatus(200)
	} else {
		res.status(400).send('Missing all sensor data')
	}
})

function processSensorData(body) {
	const temp = body.temperature
	const moisture = body.moisture
	const light = body.light

	// Stop if all value are missing
	if (temp === undefined &&
		moisture === undefined &&
		light === undefined) {
		return false
	}

	// Init record
	const timestamp = Date.now()
	const date = new Date().toISOString()
	const record = {
		"timestamp": timestamp,
		"date": date
	}

	// Receive value if need
	if (temp !== undefined) {
		record.temp = temp
	}
	if (moisture !== undefined) {
		record.moisture = moisture
	}
	if (light !== undefined) {
		record.light = light
		
	}

	// Save
	records.push(record)
	return true
}

// Start the server at 3000 port
const server = app.listen(port, function () {
   const host = "localhost"
   const port = server.address().port
   console.log("Smart Garden server is listening at http://%s:%s", host, port)
})
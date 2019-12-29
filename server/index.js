const express = require('express')
const app = express()
const port = 3000
var google_sheet = require('./google_sheet')

// Authorize with google if need
google_sheet.initGoogleSheet()

// Setup middlewares
app.use(express.json()) 

// Greeting
app.get('/', (req, res) => res.send('Hello World from Smart Garden!'))

// POST sensor data
app.post('/api/sensor', (req, res) => {
	const body = req.body

	// Create record
	const records = processSensorData(body)
	console.log(records)

	if (records.length > 0) {
		google_sheet.sendRecord(records, (err, result) => {
			if (err) {
	            console.log(err)
	            res.status(400).send('An error occurd while attempting to save data. See console output.')
	        } else {
	            const responseText = `${result.data.updates.updatedCells} cells appended.`
	            console.log(responseText);
	            res.sendStatus(200)
	        }
		})
	} else {
		res.status(400).send('Missing sensor data')
	}
})


// Start the server at 3000 port
const server = app.listen(port, function () {
   const host = "localhost"
   const port = server.address().port
   console.log("Smart Garden server is listening at http://%s:%s", host, port)
})

function processSensorData(body) {
	const temp = body.temperature
	const moisture = body.moisture
	const light = body.light

	// Stop if all value are missing
	if (temp === undefined &&
		moisture === undefined &&
		light === undefined) {
		return []
	}

	// Init record
	const timestamp = Date.now()
	const date = new Date().toISOString()
	const sheet_data = [timestamp,date]

	// Receive value if need
	if (temp !== undefined) {
		sheet_data.push(temp)
	} else {
		sheet_data.push(-1)
	}
	if (moisture !== undefined) {
		sheet_data.push(moisture)
	} else {
		sheet_data.push(-1)
	}
	if (light !== undefined) {
		sheet_data.push(light)
		
	} else {
		sheet_data.push(-1)
	}

	return sheet_data
}



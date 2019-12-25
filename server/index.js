const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
const http = require('http')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_PATH = 'token.json'
const SPREADSHEET_ID = '1qM9Ar7UdAyI5Mncz3QqybjLE3fkCkK9-h00r18FjSq8'
const RANGE = 'Sheet1'

const express = require('express')
const app = express()
const port = 3000
var authen2Client = undefined

//Load client secret from a local file
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), createServerAndGoogleSheetsObj)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function createServerAndGoogleSheetsObj(oAuth2Client) {
	//Store authentication to client for later use
	authen2Client = oAuth2Client

}

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
		const sheets = google.sheets({ version: 'v4', auth: authen2Client })
		saveDataAndSendResponse(records, sheets, (err, result) => {
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

function saveDataAndSendResponse(data, googleSheetsObj, callback) {

    // data is an array of arrays
    // each inner array is a row
    // each array element (of an inner array) is a column
    let resource = {
        values: [data],
    };

    googleSheetsObj.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        resource,
    }, callback);

}


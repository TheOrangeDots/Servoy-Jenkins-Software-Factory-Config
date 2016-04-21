//TODO does an error fail the job?
//TODO where are console.log statements ending up?

const fs = require('fs');
const request = require('request')
const path = require('path')

const args = process.argv.slice(2)
if(args.length !== 4) {
	throw new Error('ServoySolutionImport requires the Admin page URL, filename (of the file to import), username and password (to log into the Servoy Admin page) as arguments')
}

const ADMIN_PAGE_URL = args[0] + '/servoy-admin/solutions/import'
const IMPORT_FILE_PATH = path.resolve(args[1])
const USER_NAME = args[2]
const PASSWORD = args[3]

const formData = {
  if: fs.createReadStream(IMPORT_FILE_PATH),	  			// Pass File to Import
  ac: 1, 													// Activate Release
  os: 1,													// Overwrite Styles
  og: 1,													// Overwrite Group Security
  ak: 1,													// Allow keywords
  dm: 1,													// Allow data model changes
  dmc: 1,													// Display data model changes
  id: 1,													// Import i18n
  submit: 'Import!',										// Submit form
  md: 1  													//Import MetaData
}

var req = request.post({
		url: ADMIN_PAGE_URL, 
		formData: formData
	}, function callback(err, httpResponse, body) {
		if (progressReporter) {
			clearInterval(progressReporter)
		}
		if (err) {
			console.error('Solution Upload failed: ', err)
			process.exit(1)
		} else {
			var exp = /(?:<font color=".*">\[(.*)\]\<\/font><td>)(?!<)(.*)/g
			var ar;
			while ((ar = exp.exec(body)) !== null) {
				console.log(ar[1] + ' - ' + ar[2]);
			}
			
			if (!/<td>Solution .*\.servoy succesfully imported in \d*(\.\d*)? seconds/.test(body)) {
				process.exit(2)
			}
			return process.exit(0)
		}
}).auth(USER_NAME, PASSWORD, false)

const fileSize = fs.statSync(IMPORT_FILE_PATH)['size']
var progress = 0

var progressReporter = setInterval(function() {
	if (req && req.req && req.req.connection) {
		var tmp = Math.round((req.req.connection.bytesWritten / fileSize) * 100)
		if (tmp === progress && progress > 95) {
			clearInterval(progressReporter)
			if (progress !== 100) {
				console.log('Upload progress: 100%')
				console.log('Applying import...')
			}			
		} else {
			progress = tmp
			console.log("Upload progress: " + progress + '%')
		}
	} else {
		console.log('Can\'t determine progres') 
	}
}, 10000)


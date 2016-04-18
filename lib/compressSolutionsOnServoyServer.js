/*
 * Utility to compress solutions on a remote Servoy App Server.
 * 
 * When automatically uploading a new version of solutions after a successful build, the number of revisions can increase rapidly.
 * This will decrease the performance of each subsequent import.
 * 
 * This script can be executes either after each upload or schedules (for example daily or weekly)
 */

const request = require('request')
const zlib = require('zlib');

const args = process.argv.slice(2)
const ADMIN_PAGE_URL = args[0]
const USER_NAME = args[1]
const PASSWORD = args[2]

const SOLUTION_NAMES = []
var hasError = false

function compact() {
	if (!SOLUTION_NAMES.length) {
		if (hasError) {
			process.exit(3)
		}
		process.exit(0)
	}
	
	const NAME = SOLUTION_NAMES.shift()
	console.info('Compacting ' + NAME)
	request.get(ADMIN_PAGE_URL + '/servoy-admin/solutions/compact/' + NAME, function(err, httpResponse, body) {
		if (err) {
			console.error('Issue compacting solution ' + NAME, err)
			hasError = true
		}
		compact()
	}).auth(USER_NAME, PASSWORD, false)
}

var responseBody = ''
var req = request.get({
		url: ADMIN_PAGE_URL + '/servoy-admin/solutions',
		headers: {
		  "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		  "accept-encoding" : "gzip,deflate"
		}
	}
).auth(USER_NAME, PASSWORD, false)

req.on('error', function(err) {
	if (err) {
		console.error('Issue retrieving solutions', err)
		process.exit(1)
	}
})

req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
		chunks.push(chunk)
    })

    res.on('end', function() {
		var buffer = Buffer.concat(chunks)
		var encoding = res.headers['content-encoding']
		if (encoding == 'gzip') {
			zlib.gunzip(buffer, function(err, decoded) {
				callback(err, decoded && decoded.toString())
			})
		} else if (encoding == 'deflate') {
			zlib.inflate(buffer, function(err, decoded) {
				callback(err, decoded && decoded.toString())
			})
		} else {
			callback(null, buffer.toString())
		}
    })
	
	function callback(err, data) {
		if (err) {
			console.error('Issue decoding content', err)
			process.exit(2)
		}
		var exp = /<form\s+style="[^"]*" name="compact_([^"]*)" method="POST" action="([^"]*)"/gm
		var ar
		while ((ar = exp.exec(data)) !== null) {
			SOLUTION_NAMES[SOLUTION_NAMES.length] = ar[1]
		}
		console.log('Solutions to compact: ' + SOLUTION_NAMES.join())
		compact()
	}
})


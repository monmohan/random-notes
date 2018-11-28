
var net = require('net');

var client = new net.Socket();
client.connect(9000, '127.0.0.1', function() {
	console.log('Connected');
	let written=client.write('GET /largefile HTTP/1.1\r\n');
	written=client.write('Host: mylocalhost.com\r\n\r\n');
	console.log(`Drained ${written}`)
	
	
});

client.on('data', function(data:any) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
client.on('error', function(data:any) {
	console.log(`Error: ${data}`);
});
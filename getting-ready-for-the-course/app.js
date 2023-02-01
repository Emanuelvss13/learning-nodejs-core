const http = require('http');
const fs = require('fs/promises');

const PORT = 8000

const server = http.createServer(async (req, res) => {
  const content = await fs.readFile(__dirname + '/text.txt', 'utf-8')

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end(content)
})

server.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
})

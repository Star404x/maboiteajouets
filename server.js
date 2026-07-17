const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, 'out');

const server = http.createServer((req, res) => {
  let filePath = path.join(OUT_DIR, req.url);
  
  // Handle trailing slashes and index.html
  if (req.url === '/' || req.url.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // If file doesn't exist with extension, try adding .html
  if (!fs.existsSync(filePath) && !filePath.endsWith('.html')) {
    filePath += '.html';
  }
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(OUT_DIR)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    
    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy server
const proxy = httpProxy.createProxyServer({});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
  }
  res.end('Proxy error');
});

// Create server
const server = http.createServer((req, res) => {
  // Add CORS headers for development
  const writeHead = res.writeHead;
  res.writeHead = function (statusCode, headers) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    writeHead.apply(res, arguments);
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route requests
  if (req.url.startsWith('/widget-proxy-bridge')) {
    // Proxy bridge
    proxy.web(req, res, { target: 'http://localhost:4048' });
  } else {
    // Main website - everything else
    proxy.web(req, res, { target: 'http://localhost:3000' });
  }
});

const PORT = 8088;
server.listen(PORT, () => {
  console.log(
    `\n🚀 Development proxy server running on http://localhost:${PORT}\n`,
  );
  console.log('Proxying:');
  console.log('  / → http://localhost:3000 (Main website)');
  console.log(
    '  /widget-proxy-bridge/ → http://localhost:4048 (Proxy bridge)\n',
  );
});

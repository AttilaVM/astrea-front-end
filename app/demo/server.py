# -*- coding: utf-8 -*-
import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

Handler.extensions_map={
  '.manifest': 'text/cache-manifest'
  , '.html': 'text/html'
  , '.png': 'image/png'
  , '.jpg': 'image/jpg'
  , '.svg':	'image/svg+xml'
  , '.css':	'text/css'
  , '.js':	'application/x-javascript'
  # Important: glsl shaders must be served as text
  , '.glsl': 'text/plain'
  , '': 'application/octet-stream'
}

httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()

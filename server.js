/* Serveur HTTP statique minimal pour Railway.
   Aucune dépendance externe. Sert le dossier du projet. */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.pdf':  'application/pdf'
};

function send(res, code, body, headers = {}) {
  res.writeHead(code, Object.assign({ 'X-Content-Type-Options': 'nosniff' }, headers));
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  // Sécurité : empêcher la traversée de chemin
  if (urlPath.includes('..') || urlPath.includes('\0')) {
    return send(res, 400, 'Bad request');
  }

  let filePath = path.join(ROOT, urlPath);

  // Restreindre au répertoire racine
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');

  fs.stat(filePath, (err, stat) => {
    if (err) {
      // Page d'erreur très simple
      return send(res, 404, '<h1>404 - Page introuvable</h1><p><a href="/">Retour à l\'accueil</a></p>',
        { 'Content-Type': 'text/html; charset=utf-8' });
    }

    if (stat.isDirectory()) {
      // Redirection pour ajouter le slash final, indispensable aux liens relatifs
      if (!urlPath.endsWith('/')) {
        return send(res, 301, '', { Location: urlPath + '/' });
      }
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) return send(res, 404, 'Not found');
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || 'application/octet-stream';
      const cache = ext === '.html' || ext === '.json'
        ? 'no-cache'
        : 'public, max-age=86400';
      send(res, 200, data, { 'Content-Type': type, 'Cache-Control': cache });
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`MRC - site servi sur http://${HOST}:${PORT}`);
});

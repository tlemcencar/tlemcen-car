import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware global de sécurité pour autoriser l'affichage en iframe sur tous les domaines
  app.use((req, res, next) => {
    // Supprime impérativement les en-têtes bloquants X-Frame-Options (DENY et SAMEORIGIN)
    res.removeHeader('X-Frame-Options');

    // Définit la Content-Security-Policy permissive pour frame-ancestors
    // Autorise le futur domaine de production, Render, localhost et toute intégration externe
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors * 'self' http: https:;"
    );

    // En-têtes CORS pour les requêtes inter-domaines
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    next();
  });

  // Proxy endpoint pour les besoins de contournement si nécessaire
  app.get('/api/calendar-proxy', async (req, res) => {
    try {
      const carId = (req.query.carId as string) || '';
      const embed = (req.query.embed as string) || 'true';
      const theme = (req.query.theme as string) || 'emerald';

      const baseUrl = 'https://ais-pre-w6q7qyr42nk3bptuxxwiqy-637410863631.europe-west2.run.app';
      const targetUrl = `${baseUrl}/?carId=${encodeURIComponent(carId)}&embed=${encodeURIComponent(embed)}&theme=${encodeURIComponent(theme)}`;

      const resInit = await fetch(targetUrl, { redirect: 'manual' });
      const initCookies = typeof resInit.headers.getSetCookie === 'function'
        ? resInit.headers.getSetCookie()
        : [resInit.headers.get('set-cookie')].filter(Boolean) as string[];

      let cookieHeader = initCookies.map(c => c.split(';')[0]).join('; ');
      if (cookieHeader) {
        cookieHeader += '; __SECURE-aistudio_auth_flow_test=true';
      } else {
        cookieHeader = '__SECURE-aistudio_auth_flow_test=true';
      }

      let currentUrl = `${targetUrl}&__aistudio_auth_flow=true`;
      let html = '';
      let redirects = 0;

      while (redirects < 10) {
        const response = await fetch(currentUrl, {
          headers: {
            'Cookie': cookieHeader,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'manual',
        });

        const setCookies = typeof response.headers.getSetCookie === 'function'
          ? response.headers.getSetCookie()
          : [response.headers.get('set-cookie')].filter(Boolean) as string[];

        if (setCookies && setCookies.length > 0) {
          const newCookies = setCookies.map(c => c.split(';')[0]).join('; ');
          cookieHeader = `${cookieHeader}; ${newCookies}`;
        }

        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location) {
            currentUrl = new URL(location, currentUrl).toString();
            redirects++;
            continue;
          }
        }

        html = await response.text();
        break;
      }

      const baseTag = `<base href="${baseUrl}/" />`;
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors * 'self' http: https:;");
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.send(html);
    } catch (error) {
      console.error('Error in calendar proxy:', error);
      res.status(500).send('Error');
    }
  });

  // Health check API route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Serveur Vite en dev / Fichiers statiques dist en prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors * 'self' http: https:;");
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

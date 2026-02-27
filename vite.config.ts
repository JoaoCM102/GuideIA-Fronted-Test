import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-ai-api',
      configureServer(server) {
        server.middlewares.use('/api/generate', (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              const parsed = JSON.parse(body)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                response: `Mock IA responde a: "${parsed.prompt}"`,
                model: 'guideai-mock-v1',
                tokens_used: Math.floor(Math.random() * 100),
              }))
            })
          } else {
            res.statusCode = 405
            res.end('Method not allowed')
          }
        })
      },
    },
  ],
})

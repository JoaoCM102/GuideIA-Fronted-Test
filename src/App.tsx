import { useState } from 'react'
import { showGuideHtml, getGuideHtml, GuideAI } from 'guideai-npm'
import './App.css'

function App() {
  const [extractedHtml, setExtractedHtml] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState('')

  const handleShowOverlay = () => {
    showGuideHtml({ theme: 'dark', title: 'Demo GuideAI' })
  }

  const handleShowOverlayLight = () => {
    showGuideHtml({ theme: 'light', title: 'Tema Light' })
  }

  const handleExtractHtml = () => {
    const html = getGuideHtml()
    setExtractedHtml(html)
  }

  const handleTestAI = async () => {
    try {
      const ai = new GuideAI({
        baseUrl: '/api',
        timeout: 5000,
      })
      setAiStatus('Enviando petición a /api/generate...')

      const res = await ai.generate({ prompt: 'Hola desde React con GuideAI-NPM' })
      setAiStatus(`Status: ${res.status} — Respuesta: ${JSON.stringify(res.data, null, 2)}`)
    } catch (err) {
      setAiStatus(`Error: ${err instanceof Error ? err.message : err}`)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 data-guideia="titulo">GuideAI-NPM — Test React</h1>

      <section data-guideia="navegacion" style={{ marginBottom: '2rem' }}>
        <nav>
          <a href="#">Inicio</a> | <a href="#">Productos</a> | <a href="#">Contacto</a>
        </nav>
      </section>

      <section data-guideia="contenido" style={{ marginBottom: '2rem' }}>
        <h2>Contenido de ejemplo</h2>
        <p>Este párrafo está dentro de un elemento marcado con <code>data-guideia</code>.</p>
        <ul>
          <li>Elemento 1</li>
          <li>Elemento 2</li>
          <li>Elemento 3</li>
        </ul>
      </section>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button onClick={handleShowOverlay}>
          showGuideHtml (dark)
        </button>
        <button onClick={handleShowOverlayLight}>
          showGuideHtml (light)
        </button>
        <button onClick={handleExtractHtml}>
          getGuideHtml
        </button>
        <button onClick={handleTestAI}>
          Test GuideAI class
        </button>
      </div>

      {extractedHtml && (
        <div style={{ background: '#1a1a1a', color: '#eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>HTML extraído con getGuideHtml():</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
            {extractedHtml}
          </pre>
        </div>
      )}

      {aiStatus && (
        <div style={{ background: '#0a2a0a', color: '#8f8', padding: '1rem', borderRadius: '8px' }}>
          <h3>Estado GuideAI:</h3>
          <p>{aiStatus}</p>
        </div>
      )}
    </div>
  )
}

export default App

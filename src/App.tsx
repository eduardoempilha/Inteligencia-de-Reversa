import { useState, useEffect } from 'react'
import MapVisualization from './components/MapVisualization'
import MapControls from './components/MapControls'
import { LocationPoint } from './types'
import { generateSampleLocations, loadLocationsFromAPI } from './services/locationService'
import './styles/App.css'

function App() {
  const [locations, setLocations] = useState<LocationPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const apiUrl = import.meta.env.VITE_API_BASE_URL
        if (apiUrl && apiUrl !== 'http://localhost:3000') {
          const data = await loadLocationsFromAPI(apiUrl)
          setLocations(data)
        } else {
          setLocations(generateSampleLocations())
        }
      } catch (err) {
        console.error('Erro ao carregar localizações:', err)
        setError('Erro ao carregar dados. Usando dados de exemplo.')
        setLocations(generateSampleLocations())
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [])

  const handleRefresh = () => {
    setLocations(generateSampleLocations())
  }

  const handleAddLocation = (location: LocationPoint) => {
    setLocations([...locations, { ...location, id: Date.now().toString() }])
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🗺️ Inteligência de Reversa</h1>
        <p>Visualização de Pontos de Localização com VisQuill GDK</p>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <MapControls
            onRefresh={handleRefresh}
            onAddLocation={handleAddLocation}
            locationsCount={locations.length}
            isLoading={loading}
          />
        </aside>

        <section className="app-content">
          {error && <div className="error-banner">{error}</div>}
          {loading && <div className="loading-spinner">Carregando mapa...</div>}
          {!loading && <MapVisualization locations={locations} />}
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2024 Empilha Log - Powered by VisQuill GDK</p>
      </footer>
    </div>
  )
}

export default App
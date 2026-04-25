import { useState } from 'react'
import { LocationPoint } from '../types'

interface MapControlsProps {
  onRefresh: () => void
  onAddLocation: (location: LocationPoint) => void
  locationsCount: number
  isLoading: boolean
}

const MapControls: React.FC<MapControlsProps> = ({
  onRefresh,
  onAddLocation,
  locationsCount,
  isLoading,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    type: 'ponto',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.latitude || !formData.longitude) {
      alert('Por favor, preencha todos os campos')
      return
    }

    onAddLocation({
      id: Date.now().toString(),
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      type: formData.type,
    })

    setFormData({ name: '', latitude: '', longitude: '', type: 'ponto' })
    setShowForm(false)
  }

  return (
    <div className="map-controls">
      <div className="controls-header">
        <h2>🎛️ Controles</h2>
        <p className="status">📍 {locationsCount} ponto(s)</p>
      </div>

      <div className="controls-buttons">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn btn-primary"
        >
          🔄 Recarregar
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-secondary"
        >
          ➕ Novo Ponto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Ponto A"
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="Ex: -23.5505"
              step="0.0001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="Ex: -46.6333"
              step="0.0001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="ponto">Ponto</option>
              <option value="deposito">Depósito</option>
              <option value="cliente">Cliente</option>
              <option value="rota">Rota</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">✓ Adicionar</button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-cancel"
            >
              ✕ Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="controls-info">
        <h3>ℹ️ Informações</h3>
        <ul>
          <li>Clique em um ponto para detalhes</li>
          <li>Hover para destacar ponto</li>
          <li>Adicione novos pontos</li>
          <li>Latitude/Longitude em graus</li>
        </ul>
      </div>
    </div>
  )
}

export default MapControls
import { useState } from 'react'
import './App.css'
import { useEfficiency } from './hooks/useEfficiency'
import { EfficiencyCalculator } from './components/EfficiencyCalculator'
import { EfficiencyDashboard } from './components/EfficiencyDashboard'

function App() {
  const { result, loading, error, calculate, loadBuilding } = useEfficiency()
  const [searchId, setSearchId] = useState('')

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Energy Efficiency Tracker</h1>
          <p>Track energy efficiency improvements across building operational periods</p>
        </div>
      </header>

      <main className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter building ID to load existing data..."
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchId && loadBuilding(searchId)}
          />
          <button
            onClick={() => searchId && loadBuilding(searchId)}
            disabled={loading || !searchId}
          >
            Load Building
          </button>
        </div>

        <EfficiencyCalculator onCalculate={calculate} loading={loading} />

        {error && <div className="error-banner">{error}</div>}

        {result ? (
          <EfficiencyDashboard result={result} />
        ) : (
          !loading && (
            <div className="empty-state">
              Submit a calculation above or load an existing building to see results.
            </div>
          )
        )}
      </main>
    </div>
  )
}

export default App

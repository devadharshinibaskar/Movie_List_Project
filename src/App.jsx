import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import MovieCollection from './components/MovieCollection'

const API_KEY = '84af4759358010c38d7172880a358d16'
const TMDB_BASE = 'https://api.themoviedb.org/3'

function buildCollectionUrl(collectionId) {
  const params = new URLSearchParams({ api_key: API_KEY, language: 'en-US' })
  return `${TMDB_BASE}/collection/${collectionId}?${params}`
}

function App() {
  const [collectionId, setCollectionId] = useState('86311')
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchCollection = useCallback(async () => {
    setError(null)
    setLoading(true)

    try {
      const resp = await axios.get(buildCollectionUrl(collectionId))
      setCollection(resp.data)
    } catch (err) {
      console.error(err)
      setCollection(null)
      setError(
        err?.response?.data?.status_message ||
          'Unable to load collection. Please check the collection ID and try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [collectionId])

  useEffect(() => {
    fetchCollection()
  }, [fetchCollection])

  const filteredParts = useMemo(() => {
    if (!collection?.parts) return []
    if (!query.trim()) return collection.parts

    const lower = query.toLowerCase()
    return collection.parts.filter((part) =>
      part.title.toLowerCase().includes(lower)
    )
  }, [collection, query])

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__logo">
          <span className="app__logo-dot" />
          <h1>Movie Recycler</h1>
        </div>

        <form
          className="collection-selector"
          onSubmit={(event) => {
            event.preventDefault()
            fetchCollection()
          }}
        >
          <label className="collection-selector__label">
            Collection ID
            <input
              className="collection-selector__input"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value.trim())}
              placeholder="e.g. 86311"
              inputMode="numeric"
            />
          </label>

          <button type="submit" className="collection-selector__button">
            Load
          </button>
        </form>
      </header>

      <main className="app__main">
        {loading && (
          <div className="status">
            <p>Loading collection...</p>
          </div>
        )}

        {error && (
          <div className="status status--error">
            <p>{error}</p>
          </div>
        )}

        {collection && !loading && !error && (
          <MovieCollection
            collection={collection}
            parts={filteredParts}
            query={query}
            setQuery={setQuery}
          />
        )}
      </main>

      <footer className="app__footer">
        <p>
          Powered by <a href="https://developers.themoviedb.org/3" target="_blank" rel="noreferrer">TMDB</a>
        </p>
      </footer>
    </div>
  )
}

export default App

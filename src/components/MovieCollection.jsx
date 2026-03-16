import { useMemo } from 'react'
import MovieCard from './MovieCard'

function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function MovieCollection({ collection, parts, query, setQuery }) {
  const total = collection?.parts?.length ?? 0
  const filteredCount = parts.length

  const summary = useMemo(() => {
    const year = collection?.release_date ? new Date(collection.release_date).getFullYear() : null
    return year ? `${collection.name} · ${year}` : collection.name
  }, [collection])

  return (
    <section className="collection">
      <header className="collection__header">
        <div className="collection__info">
          <h2 className="collection__title">{summary}</h2>
          <p className="collection__overview">{collection.overview}</p>
          <div className="collection__stats">
            <span>{formatCount(total)} movies in collection</span>
            {filteredCount !== total && (
              <span className="collection__stats--muted">
                Showing {formatCount(filteredCount)} of {formatCount(total)}
              </span>
            )}
          </div>
        </div>

        <div className="collection__search">
          <label className="collection__search-label">
            Filter movies
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title…"
              className="collection__search-input"
              autoComplete="off"
            />
          </label>
        </div>
      </header>

      <div className="movie-grid" role="list">
        {parts.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}

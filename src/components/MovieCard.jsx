import { useMemo } from 'react'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function getPosterUrl(path) {
  if (!path) return null
  return `${IMAGE_BASE}${path}`
}

function formatYear(dateString) {
  if (!dateString) return ''

  try {
    const year = new Date(dateString).getFullYear()
    return isNaN(year) ? '' : String(year)
  } catch {
    return ''
  }
}

export default function MovieCard({ movie }) {
  const posterUrl = useMemo(() => getPosterUrl(movie.poster_path), [movie.poster_path])
  const year = useMemo(() => formatYear(movie.release_date), [movie.release_date])

  return (
    <article className="movie-card" role="listitem">
      <div className="movie-card__poster">
        {posterUrl ? (
          <img
            loading="lazy"
            src={posterUrl}
            alt={`Poster for ${movie.title}`}
            width={250}
            height={375}
          />
        ) : (
          <div className="movie-card__poster--placeholder" aria-hidden="true">
            No poster
          </div>
        )}
      </div>

      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__meta">
          {year && <span>{year}</span>} {movie.vote_average ? `• ${movie.vote_average.toFixed(1)} ⭐` : ''}
        </p>
        {movie.overview ? (
          <p className="movie-card__overview">{movie.overview}</p>
        ) : (
          <p className="movie-card__overview movie-card__overview--muted">No overview available.</p>
        )}
      </div>
    </article>
  )
}

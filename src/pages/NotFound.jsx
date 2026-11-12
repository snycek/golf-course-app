import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow center">
        <h1>Out of bounds</h1>
        <p>That page doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </section>
  )
}

// Placeholder crest until the owner's real logo is supplied. Uses
// currentColor so it works as a small nav mark and as a faint watermark.
export default function Crest({ className = '', title }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} fill="none" stroke="currentColor">
      {title && <title>{title}</title>}
      <defs>
        <path id="crest-ring" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
      </defs>
      <circle cx="100" cy="100" r="96" strokeWidth="2" />
      <circle cx="100" cy="100" r="88" strokeWidth="1" />
      <circle cx="100" cy="100" r="58" strokeWidth="1" />
      <text fill="currentColor" stroke="none" fontFamily="Playfair Display, Georgia, serif" fontSize="15" letterSpacing="5">
        <textPath href="#crest-ring" startOffset="2%">TEEIN’ IT UP · SOUTHGATE · MICHIGAN ·</textPath>
      </text>
      {/* flag on the green */}
      <path d="M92 128 V70" strokeWidth="3" strokeLinecap="round" />
      <path d="M93 71 L122 81 L93 91 Z" fill="currentColor" stroke="none" />
      <ellipse cx="100" cy="130" rx="30" ry="6" strokeWidth="2" />
      <circle cx="112" cy="124" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}

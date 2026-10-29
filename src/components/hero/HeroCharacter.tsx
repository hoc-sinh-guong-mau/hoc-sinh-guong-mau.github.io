import type { CharacterArtwork } from '../../types/portfolio'

/** Replacement arm/hand assets share the portrait's canvas and registration. */
export function HeroCharacter({ artwork }: { artwork: CharacterArtwork }) {
  return (
    <div className="hero-character" data-hero-character aria-hidden="true">
      <div className="character-body" data-character-part="body">
        <img
          src={artwork.body.src}
          width={artwork.body.width}
          height={artwork.body.height}
          alt=""
          fetchPriority="high"
        />
      </div>
      {artwork.arm && (
        <div
          className="character-arm"
          data-character-part="arm"
          style={{ transformOrigin: artwork.arm.pivot }}
        >
          <img
            src={artwork.arm.src}
            width={artwork.arm.width}
            height={artwork.arm.height}
            alt=""
          />
        </div>
      )}
      {artwork.hand && (
        <div
          className="character-hand"
          data-character-part="hand"
          style={{ transformOrigin: artwork.hand.pivot }}
        >
          <img
            src={artwork.hand.src}
            width={artwork.hand.width}
            height={artwork.hand.height}
            alt=""
          />
        </div>
      )}
    </div>
  )
}

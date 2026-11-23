/**
 * SDN Fotografie delivery paths under `public/design-system/photography`.
 * Masters live in `assets/img/`. Replace with Payload Media relations after final CMS mapping.
 * Gais uses shared interiors — never label as Gais-only exteriors.
 * Patient-adjacent frames (303348 / 303361) are available on disk but omitted from homepage defaults until consent.
 */

const P = '/design-system/photography' as const
const V = '/design-system/video' as const

/** Welcoming loop for Appenzell hero (muted autoplay). */
export const PRACTICE_VIDEOS = {
  appenzell: {
    welcoming: `${V}/welcoming-hero.mp4`,
    welcomingPoster: `${V}/welcoming-hero-poster.jpg`,
  },
} as const

export const PRACTICE_PHOTOS = {
  appenzell: {
    /** Temporary Alpine stand-in — Picdrop pack has no exteriors. */
    hero: `${P}/appenzell-alpine-hero.jpg`,
    reception: `${P}/Palatty-15052026-303475.jpg`,
    receptionActivity: `${P}/Palatty-15052026-303305.jpg`,
    treatment: `${P}/Palatty-15052026-303511.jpg`,
    treatmentAlt: `${P}/Palatty-15052026-303529.jpg`,
    treatmentTall: `${P}/Palatty-15052026-303516.jpg`,
    hallway: `${P}/Palatty-15052026-303541.jpg`,
    hallwayAlt: `${P}/Palatty-15052026-303527.jpg`,
    hallwayPeople: `${P}/Palatty-15052026-303384.jpg`,
    deskDetail: `${P}/Palatty-15052026-303542.jpg`,
    team: `${P}/Palatty-15052026-303287.jpg`,
    teamPair: `${P}/Palatty-15052026-303334.jpg`,
    portraits: {
      belma: `${P}/BelmaMusic-15052026-303202.jpg`,
      christina: `${P}/ChristinaMileraPoput-15052026-303141.jpg`,
      dalina: `${P}/DalinaJahiu-15052026-303097.jpg`,
      jeanine: `${P}/JeanineWeishaupt-15052026-303168.jpg`,
      riana: `${P}/RianaSutter-15052026-303207.jpg`,
    },
  },
  gais: {
    /** Shared SDN interior — not a Gais-specific exterior. */
    hero: `${P}/Palatty-15052026-303541.jpg`,
    reception: `${P}/Palatty-15052026-303511.jpg`,
    receptionActivity: `${P}/Palatty-15052026-303305.jpg`,
    treatment: `${P}/Palatty-15052026-303475.jpg`,
    treatmentAlt: `${P}/Palatty-15052026-303529.jpg`,
    treatmentTall: `${P}/Palatty-15052026-303516.jpg`,
    hallway: `${P}/Palatty-15052026-303527.jpg`,
    hallwayAlt: `${P}/Palatty-15052026-303541.jpg`,
    hallwayPeople: `${P}/Palatty-15052026-303384.jpg`,
    deskDetail: `${P}/Palatty-15052026-303542.jpg`,
    team: `${P}/Palatty-15052026-303287.jpg`,
    teamPair: `${P}/Palatty-15052026-303334.jpg`,
    portraits: {
      belma: `${P}/BelmaMusic-15052026-303202.jpg`,
      christina: `${P}/ChristinaMileraPoput-15052026-303141.jpg`,
      dalina: `${P}/DalinaJahiu-15052026-303097.jpg`,
      jeanine: `${P}/JeanineWeishaupt-15052026-303168.jpg`,
      riana: `${P}/RianaSutter-15052026-303207.jpg`,
    },
  },
} as const

export type PracticePhotoSet = (typeof PRACTICE_PHOTOS)[keyof typeof PRACTICE_PHOTOS]

export function getPracticePhotos(slug: string): PracticePhotoSet {
  return slug === 'gais' ? PRACTICE_PHOTOS.gais : PRACTICE_PHOTOS.appenzell
}

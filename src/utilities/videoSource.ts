export function resolveVideoSource(
  src?: string | null,
  hlsUrl?: string | null,
  mediaType?: string | null,
  poster?: string | null,
) {
  const playlist = /\.m3u8(?:[?#]|$)/i
  const isHls = mediaType === 'hls' || playlist.test(hlsUrl || src || '')
  const isImageFile = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#]|$)/i.test(src || '')
  const isImage = !isHls && (mediaType === 'image' || isImageFile)
  return {
    isHls,
    isImage,
    videoSrc: isHls && hlsUrl ? hlsUrl : src || undefined,
    posterSrc: poster || (isHls && isImageFile && src ? src : undefined),
  }
}

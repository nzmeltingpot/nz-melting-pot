/*
  videos: [{ thumb: '/images/...', alt: '...', url: 'https://...', title?: '...' }]
  Clicking a video thumbnail opens the url in a new tab.
*/
export default function VideoLightbox({ videos }) {
  const handleClick = (video) => {
    if (video.url) {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="video-grid">
      {videos.map((video, i) =>
      <button
        key={i}
        className="video-item"
        onClick={() => handleClick(video)}
        aria-label={`Watch ${video.title || `video ${i + 1}`} on Google Photos`}>

          <img src={video.thumb} alt={video.alt} width="600" height="400" loading="lazy" decoding="async" />
          <div className="video-item__play">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </button>
      )}
    </div>);

}
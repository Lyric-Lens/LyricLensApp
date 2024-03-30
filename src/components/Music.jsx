import { useState } from "react";

export default function Music(val, i) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  console.log(val);

  return (
    <>
      <div className={`flex justify-between items-center ${iframeLoading ? '' : ''}`}>

          <div className="flex items-center">

            <div style={{backgroundImage: `url(${val.val.thumbnailUrl})`}} className={`w-[48px] h-[48px] rounded-lg m-4 flex justify-center items-center`} onClick={() => {
                if (isPlaying) {
                  document.getElementById(`youtube-player-${i}`).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                  setIsPlaying(false);
                } else {
                  document.getElementById(`youtube-player-${i}`).contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                  setIsPlaying(true);
                }
              }}>
              <img src={`${isPlaying ? 'Pause.svg' : 'Play.svg'}`} alt="Music cover" className="w-[24px] h-[24px] rounded-lg" />
            </div>

            <div className="flex flex-col">
              <p className="font-bold my-1">{val.val.title}</p>
              <p className="text-xs opacity-50 my-1">{val.val.artists[0].name}</p>
            </div>

          </div>

        <iframe
          id={`youtube-player-${i}`}
          className="hidden"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${val.val.youtubeId}?enablejsapi=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onLoad={() => setIframeLoading(false)}
        />
      </div>
      <hr className="w-[80vw] ms-4" />
    </>
  )
}
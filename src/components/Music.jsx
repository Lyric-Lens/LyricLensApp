import { useMusicPlayer } from "./MusicPlayerContext";

export default function Music(val) {
//  const [iframeLoading, setIframeLoading] = useState(true);
 const { playTrack, currentTrack } = useMusicPlayer();

 function handlePlayPause() {
    if (currentTrack === val.val.youtubeId) {
      // If the current track is playing, pause it
      document.getElementById(`music-player`).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      playTrack(null); // Update the context to indicate no track is playing
    } else {
      // If a different track is playing, stop it
      if (currentTrack) {
        document.getElementById(`music-player`).contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
      }
      // Remove the current track
      playTrack(null);
      // Start playing the new track
      playTrack(val.val.youtubeId, val.val.title, val.val.artists[0].name, val.val.thumbnailUrl);
    }
 }

 return (
    <>
      {/* Music display in list */}
      <div className={`flex justify-between items-center`}>
        <div className="flex items-center">
          <div style={{backgroundImage: `url(${val.val.thumbnailUrl})`}} className={`w-[48px] h-[48px] rounded-lg m-4 flex justify-center items-center`} onClick={handlePlayPause}>
            <img src={`${currentTrack === val.val.youtubeId ? 'Pause.svg' : 'Play.svg'}`} alt="Music cover" className="w-[24px] h-[24px] rounded-lg" />
          </div>
          <div className="flex flex-col">
            <p className="font-bold my-1">{val.val.title}</p>
            <p className="text-xs opacity-50 my-1">{val.val.artists[0].name}</p>
          </div>
        </div>
      </div>

      {/* <div className={`m-4 flex justify-between items-center`}>
        <div className="flex items-center">
          <div className="skeleton w-24 h-24 me-2"></div>
          <div className="flex flex-col">
            <div className="skeleton w-48 h-4 my-2"></div>
            <div className="skeleton w-24 h-4 my-2"></div>
          </div>
        </div>
      </div> */}
      <hr className="w-[80vw] ms-4" />
    </>
 );
}
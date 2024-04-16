import { useMusicPlayer } from "./MusicPlayerContext";

export default function Music(val) {
 const { playTrack, currentTrack } = useMusicPlayer();

 function handlePlayPause() {
    if (currentTrack === val.val.youtubeId) {
      playTrack(null); // Update the context to indicate no track is playing
    } else {
      // Remove the current track
      playTrack(null);
      // Start playing the new track
      playTrack(val.val.youtubeId, val.val.title, val.val.artists[0].name, val.val.thumbnailUrl);

      // Update history
      const history = JSON.parse(localStorage.getItem('history')) || [];
      // TODO: check for duplicate track and remove it
      const index = history.findIndex(h => h.val.youtubeId === val.val.youtubeId);
      if(index > -1) {
        history.splice(index, 1);
      }
      if (history.length >= 20) {
        history.pop();
      }
      history.unshift(val);
      localStorage.setItem('history', JSON.stringify(history));
    }
 }

 return (
    <>
      {/* Music display in list */}
      <div className={`flex justify-between items-center hover:opacity-50 hover:cursor-pointer transition duration-300`} onClick={handlePlayPause}>
        <div className="flex items-center">
          <div style={{backgroundImage: `url(${val.val.thumbnailUrl})`}} className={`w-[48px] h-[48px] rounded-lg m-4 flex justify-center items-center`} />
          <div className="flex flex-col">
            <p className="font-bold my-1">{val.val.title.slice(0, 30) + (val.val.title.length > 30 ? '...' : '')}</p>
            <p className="text-xs opacity-50 my-1">{val.val.artists[0].name.slice(0, 20) + (val.val.artists[0].name.length > 20 ? '...' : '')}</p>
          </div>
        </div>
      </div>
      <hr className="w-[80vw] ms-4" />
    </>
 );
}
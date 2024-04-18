import Music from "../components/Music";

export default function Home() {
  return (
    <div className="ms-4">
      <p className="float-right me-8 mt-1 opacity-50">See all</p>{/* also make this redirect to collection i guess -- yes that was the plan */}
      <h2 className="font-bold text-2xl ms-4 mb-2">Playlists</h2>
      {/* Playlist */}
      <h2 className="font-bold text-2xl ms-4 mb-2">Recents</h2>
      {localStorage.getItem('history') && localStorage.getItem('history').length > 2 ? JSON.parse(localStorage.getItem('history')).map((val, i) => (
        <Music key={i} val={val.val} />
      )) : (<p className="ms-4">No music listened yet!</p>)}
    </div>
  )
}
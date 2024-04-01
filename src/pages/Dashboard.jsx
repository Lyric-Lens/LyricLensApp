import { useEffect, useState } from "react"
import { api } from "../utils/API";
import Music from "../components/Music";
import { useMusicPlayer } from "../components/MusicPlayerContext";

export default function Dashboard() {
  // Music player config
  const { currentTrack } = useMusicPlayer();
  const [musicPlay, setMusicPlay] = useState(false);

  // Determine page: Home, Explore, Collection, Profile
  const [page, setPage] = useState('home');
  useEffect(() => {
    // Redirect on invalid page
    const routes = ['home', 'explore', 'collection', 'profile', 'search'];
    if (!routes.includes(page)) {
      setPage('home');
    }
  }, [page]);

  // Get user's photo
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    api.get(`/users/${localStorage.getItem('userId')}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((res) => {
      setPhoto(res.data.user.photo);
    })
    .catch((err) => {
      console.log(err);
    })
  }, [photo])

  // Search
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (search !== '') {
      setPage('search');
      api.post('/searchMusic', {
        search: search
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then((res) => {
        setSearchResults(res.data.results);
        setSearch('');
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      })
    }
  }, [search])
  function searchMusic(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setSearch(formData.get('search'));
  }

  return (
    <>
      <div className="bg-[url('Background.png')] bg-cover bg-no-repeat bg-center w-screen h-screen">

        {page === 'search' && (
          <>
            {/* Header - Search bar and settings */}
            <div className="flex justify-around items-center p-4">

              {/* Search bar */}
              <label className="input input-bordered flex items-center gap-2 rounded-full">
                <form onSubmit={searchMusic}>
                  <input type="text" className="grow" placeholder="Search" name="search" id="search" defaultValue={new URLSearchParams(window.location.search).get('search')} />
                  <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                  </button>
                </form>
              </label>

              {/* Settings */}
              <img src="Settings.svg" alt="Settings button" className="btn btn-ghost w-[56px] h-[56px]" onClick={()=>document.getElementById('settingsModal').showModal()} />

            </div>

            {/* Search results */}
            <div className="h-[75vh] overflow-y-scroll">
              {searchResults.map((val, i) => (
                <Music key={i} val={val} />
              ))}
            </div>

            {/* Settings dialog */}
            <dialog id="settingsModal" className="modal">
              <div className="modal-box">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Settings</h3>
                  <form method="dialog">
                    <button className="btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f9f9" className="bi bi-x" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    </button>
                  </form>
                </div>
                <div className="py-4">
                  {/* Logout */}
                  <p onClick={function() { localStorage.removeItem('email'); localStorage.removeItem('token'); location.reload(); }} className="text-red-400">Log out</p>
                </div>
              </div>
            </dialog>
          </>
        )}

        {/* Home page */}
        {page === 'home' && (
        <>
          {/* Header - Search bar and settings */}
          <div className="flex justify-around items-center p-4">

            {/* Search bar */}
            <label className="input input-bordered flex items-center gap-2 rounded-full">
              <form onSubmit={searchMusic}>
                <input type="text" className="grow" placeholder="Search" name="search" id="search" />
                <button type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                </button>
              </form>
            </label>

            {/* Settings */}
            <img src="Settings.svg" alt="Settings button" className="btn btn-ghost w-[56px] h-[56px]" onClick={()=>document.getElementById('settingsModal').showModal()} />

          </div>

          {/* Settings dialog */}
          <dialog id="settingsModal" className="modal">
            <div className="modal-box">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Settings</h3>
                <form method="dialog">
                  <button className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f9f9" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                  </button>
                </form>
              </div>
              <div className="py-4">
                {/* Logout */}
                <p onClick={function() { localStorage.removeItem('email'); localStorage.removeItem('token'); location.reload(); }} className="text-red-400">Log out</p>
              </div>
            </div>
          </dialog>
        </>
        )}

        {page === 'explore' && (
        <>
        explore
        </>
        )}

        {page === 'collection' && (
        <>
        collection
        </>
        )}

        {page === 'profile' && (
        <>
        profile
        </>
        )}
      </div>

      {/* Current track indicator */}
      {currentTrack && (
        <div className={`flex justify-between items-center fixed bottom-20 bg-[#212529] w-[95vw] mx-2 rounded-lg`}>
          <div className="flex items-center">
            <div style={{backgroundImage: `url(${localStorage.getItem('currentTrackThumbnail')})`}} className={`w-[48px] h-[48px] rounded-lg m-4 flex justify-center items-center`}></div>
            <div className="flex flex-col">
              <p className="font-bold my-1" title={localStorage.getItem('currentTrackTitle')}>{localStorage.getItem('currentTrackTitle').slice(0, 10) + (localStorage.getItem('currentTrackTitle').length > 10 ? '...' : '')}</p>
              <p className="text-xs opacity-50 my-1" title={localStorage.getItem('currentTrackAuthor')}>{localStorage.getItem('currentTrackAuthor').slice(0, 10) + (localStorage.getItem('currentTrackAuthor').length > 10 ? '...' : '')}</p>
            </div>
          </div>
          <div className="flex items-center me-8">
            <img src="Previous.svg" alt="Previous button" className="mx-1 w-[16px] h-[16px]" />
            <img src={`${musicPlay ? 'Pause.svg' : 'Play.svg'}`} alt="Music cover" className="mx-1 w-[32px] h-[32px] rounded-lg" onClick={() => {
              if (musicPlay === false) {
                document.getElementById(`music-player`).contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                setMusicPlay(true);
              } else {
                document.getElementById(`music-player`).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                setMusicPlay(false);
              }
            }} />
            <img src="Next.svg" alt="Next button" className="mx-1 w-[16px] h-[16px]" />
          </div>
        </div>
      )}

      {/* Music player */}
      <iframe
        id='music-player'
        className="hidden"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${currentTrack}?enablejsapi=1`}
        title="Music player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => {
          if (musicPlay) {
            document.getElementById('music-player').contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'playVideo',
              args: [],
            }), '*');
          }
        }}
        key={currentTrack}
      />

      {/* Bottom navbar */}
      <div className="flex justify-between items-center px-4 fixed bottom-0 w-screen h-[70px] bg-[#111] border-t border-[#6C757D]">

        <div onClick={function() {setPage('home')}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={page === 'home' ? "HomeActive.svg" : "Home.svg"} alt="Home Page" className="w-[24px] h-[24px]" />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'home' ? '' : 'opacity-50'}`}>Home</p>
        </div>

        <div onClick={function() {setPage('explore')}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={page === 'explore' ? "ExploreActive.svg" : "Explore.svg"} alt="Explore Page" className="w-[24px] h-[24px]" />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'explore' ? '' : 'opacity-50'}`}>Explore</p>
        </div>

        <div onClick={function() {setPage('collection')}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={page === 'collection' ? "CollectionActive.svg" : "Collection.svg"} alt="Collection Page" className="w-[24px] h-[24px]" />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'collection' ? '' : 'opacity-50'}`}>Collection</p>
        </div>

        <div onClick={function() {setPage('profile')}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={photo || "UserPlaceholder.svg"} alt="Profile Page" className={`${page === 'profile' ? '' : 'opacity-50'} w-[24px] h-[24px]`} />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'profile' ? '' : 'opacity-50'}`}>Profile</p>
        </div>

      </div>
    </>
  )
}
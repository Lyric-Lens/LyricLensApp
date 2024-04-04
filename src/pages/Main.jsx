import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { api } from "../utils/API";
import { useMusicPlayer } from "../components/MusicPlayerContext";
import ReactPlayer from 'react-player/youtube'
import DurationFormatting from "../components/DurationFormatting";

import Home from "./Home";
import Search from "./Search";
import Explore from "./Explore";
import Collection from "./Collection";
import Profile from "./Profile";

const MainContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useMainContext = () => useContext(MainContext);

export default function Main() {
  // Determine page: Home, Explore, Collection, Profile, Search
  const [page, setPage] = useState('home');
  useEffect(() => {
    // Redirect on invalid page
    const routes = ['home', 'explore', 'collection', 'profile', 'search'];
    if (!routes.includes(page)) {
      setPage('home');
    }
  }, [page]);

  // Search
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (search !== '') {
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
        setPage('search');
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

  // Music player config
  const { currentTrack } = useMusicPlayer();
  const [musicPlay, setMusicPlay] = useState(true);
  const [lyrics, setLyrics] = useState('');
  const handleMusicEnd = useCallback(() => {
    setMusicPlay(false);
  }, []);
  useEffect(() => {
    api.post(`/lyrics`, {
      author: localStorage.getItem('currentTrackAuthor'),
      title: localStorage.getItem('currentTrackTitle')
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
  }, [currentTrack])

  // Music page config
  const [musicPage, setMusicPage] = useState(false);
  const musicPlayer = useRef(null);
  const [durationValue, setDurationValue] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDurationValue(Math.round(musicPlayer.current.getCurrentTime()));
    }, 1);
    return () => clearInterval(interval);
  }, [musicPlayer]);

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

  return (
    <>
      <div className="bg-[url('Background.png')] bg-cover bg-no-repeat bg-center w-screen h-screen">

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

        {page === 'search' && (
          <>
            <Search searchResults={searchResults} />
          </>
        )}

        {/* Home page */}
        {page === 'home' && (
          <Home />
        )}

        {page === 'explore' && (
        <>
          <Explore />
        </>
        )}

        {page === 'collection' && (
        <>
          <Collection />
        </>
        )}

        {page === 'profile' && (
        <>
          <Profile />
        </>
        )}
      </div>

      {/* Current track indicator */}
      {currentTrack && (
        <div className={`flex justify-between items-center fixed bottom-20 bg-[#212529] w-[95vw] mx-2 rounded-lg`}>

          <div onClick={()=>{setMusicPage(true)}} className="hover:cursor-pointer flex items-center flex-grow">

            {/* Track thumbnail */}
            <div style={{backgroundImage: `url(${localStorage.getItem('currentTrackThumbnail')})`}} className={`w-[48px] h-[48px] rounded-lg m-4 flex justify-center items-center`}></div>

            <div className="flex flex-col">

              {/* Track title */}
              <p className="font-bold my-1" title={localStorage.getItem('currentTrackTitle')}>{localStorage.getItem('currentTrackTitle').slice(0, 10) + (localStorage.getItem('currentTrackTitle').length > 10 ? '...' : '')}</p>

              {/* Track author */}
              <p className="text-xs opacity-50 my-1" title={localStorage.getItem('currentTrackAuthor')}>{localStorage.getItem('currentTrackAuthor').slice(0, 10) + (localStorage.getItem('currentTrackAuthor').length > 10 ? '...' : '')}</p>

            </div>

          </div>

          <div className="flex items-center me-8">

            {/* Previous track button */}
            <img src="Previous.svg" alt="Previous button" className="mx-1 w-[16px] h-[16px]" />

            {/* Play or pause button */}
            <img src={`${musicPlay ? 'Pause.svg' : 'Play.svg'}`} alt="Music cover" className="mx-1 w-[32px] h-[32px] rounded-lg hover:cursor-pointer" onClick={() => {
              musicPlay === false ? setMusicPlay(true) : setMusicPlay(false)
            }} />

            {/* Next track button */}
            <img src="Next.svg" alt="Next button" className="mx-1 w-[16px] h-[16px]" />

          </div>

        </div>
      )}

      {/* Music page */}
      {musicPage && (
        <div className="fixed inset-0 z-50" style={{top: 0, left: 0}}>
          <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
            <div className="absolute inset-0" style={{zIndex: -1}}></div>
            <div className="relative w-screen h-screen p-4 flex justify-center items-center">
              <div className="flex justify-start items-center text-center fixed top-8 w-screen px-8">
                {/* Close */}
                <button className="btn btn-ghost" onClick={() => {setMusicPage(false)}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#F9F9F9" strokeOpacity="0.5"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17 12C17 11.8821 16.9624 11.7691 16.8954 11.6858C16.8284 11.6024 16.7376 11.5556 16.6429 11.5556H8.21985L10.4676 8.75957C10.5008 8.71825 10.5271 8.6692 10.5451 8.61522C10.563 8.56123 10.5723 8.50337 10.5723 8.44494C10.5723 8.38651 10.563 8.32865 10.5451 8.27467C10.5271 8.22069 10.5008 8.17164 10.4676 8.13032C10.4344 8.089 10.3949 8.05623 10.3516 8.03387C10.3082 8.01151 10.2617 8 10.2147 8C10.1678 8 10.1213 8.01151 10.0779 8.03387C10.0345 8.05623 9.99508 8.089 9.96188 8.13032L7.10492 11.6854C7.07166 11.7267 7.04527 11.7757 7.02727 11.8297C7.00927 11.8837 7 11.9415 7 12C7 12.0585 7.00927 12.1163 7.02727 12.1703C7.04527 12.2243 7.07166 12.2733 7.10492 12.3146L9.96188 15.8697C9.99508 15.911 10.0345 15.9438 10.0779 15.9661C10.1213 15.9885 10.1678 16 10.2147 16C10.2617 16 10.3082 15.9885 10.3516 15.9661C10.3949 15.9438 10.4344 15.911 10.4676 15.8697C10.5008 15.8284 10.5271 15.7793 10.5451 15.7253C10.563 15.6713 10.5723 15.6135 10.5723 15.5551C10.5723 15.4966 10.563 15.4388 10.5451 15.3848C10.5271 15.3308 10.5008 15.2818 10.4676 15.2404L8.21985 12.4444H16.6429C16.7376 12.4444 16.8284 12.3976 16.8954 12.3142C16.9624 12.2309 17 12.1179 17 12Z" fill="#F9F9F9"/>
                  </svg>
                </button>
              </div>
              {/* Music info */}
              <div className="flex flex-col justify-center items-center h-[50vh] mb-48 overflow-y-scroll">
                <div className="flex flex-col justify-center items-center">
                  <img src={localStorage.getItem('currentTrackThumbnail')} alt="Music cover" className="w-[240px] h-[240px] my-8 rounded-lg" />
                  <h2 className="font-bold">{localStorage.getItem('currentTrackTitle')}</h2>
                  <p className="text-sm opacity-50">{localStorage.getItem('currentTrackAuthor')}</p>
                </div>
                <br />
                <div className="flex flex-col justify-center items-center">
                  <p className="">{lyrics}</p>
                </div>
              </div>
              {/* Music control */}
              <div className="flex flex-col justify-center items-center text-center fixed bottom-8">
              <p className="text-sm mb-2">{DurationFormatting(durationValue)} - {DurationFormatting(maxDuration)}</p>
                <input type="range" name="duration" id="duration" min="0" max={maxDuration} value={durationValue}  onChange={(event) => {
                  musicPlayer.current.seekTo(event.target.value);
                  setMusicPlay(true);
                }} className="range range-xs [--range-shdw:#f9f9f9] w-[80vw]" />
                <hr className="h-[1px] w-screen my-8 opacity-50" />
                <div className="flex justify-center items-center">
                  {/* Previous track button */}
                  <img src="Previous.svg" alt="Previous button" className="mx-1 w-[24px] h-[24px]" />
                  {/* Play or pause button */}
                  <img src={`${musicPlay ? 'Pause.svg' : 'Play.svg'}`} alt="Music cover" className="mx-2 w-[48px] h-[48px] rounded-lg hover:cursor-pointer" onClick={() => {
                    musicPlay === false ? setMusicPlay(true) : setMusicPlay(false)
                  }} />
                  {/* Next track button */}
                  <img src="Next.svg" alt="Next button" className="mx-1 w-[24px] h-[24px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Music player */}
      <ReactPlayer
        ref={musicPlayer}
        id='music-player'
        controls
        onEnded={handleMusicEnd}
        onReady={() => {
          if (musicPlayer.current) {
            const duration = musicPlayer.current.getDuration();
            setMaxDuration(duration);
          }
        }}
        playing={musicPlay}
        className="hidden"
        url={`https://www.youtube.com/watch?v=${currentTrack}`}
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
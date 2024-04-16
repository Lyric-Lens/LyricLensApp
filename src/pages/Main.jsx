import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "../utils/API";
import { useMusicPlayer } from "../components/MusicPlayerContext";
import ReactPlayer from 'react-player/youtube'
import DurationFormatting from "../components/DurationFormatting";

import Home from "./Home";
import Search from "./Search";
import Explore from "./Explore";
import Collection from "./Collection";
import Profile from "./Profile";

export default function Main() {
  // Determine page: Home, Explore, Collection, Profile, Search
  const [page, setPage] = useState('home');
  const [previousPage, setPreviousPage] = useState('');
  useEffect(() => {
    // Redirect on invalid page
    const routes = ['home', 'explore', 'collection', 'profile', 'search', 'music', 'playlist'];
    if (!routes.includes(page)) {
      setPage('home');
    }

    // Save previous page for back button functionality
    if (page !== 'music' && page !== 'playlist') {
      setPreviousPage(page);
    }
  }, [page]);

  // Remove the track data after refresh
  const componentMount = useRef(false);
  useEffect(() => {
    localStorage.removeItem('currentTrack');
    localStorage.removeItem('currentTrackAuthor');
    localStorage.removeItem('currentTrackTitle');
    localStorage.removeItem('currentTrackThumbnail');
    localStorage.removeItem('currentTrackLyrics');
    localStorage.removeItem('currentTrackInterpretation');
    componentMount.current = true;
  }, []);

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
  const [loop, setLoop] = useState(false);
  const handleMusicEnd = useCallback(() => {
    if (loop === false) {
      setMusicPlay(false);
    } else {
      musicPlayer.current.seekTo(0);
      setMusicPlay(true);
      localStorage.setItem('addMusicCount', Number(localStorage.getItem('addMusicCount')) + 1);
    }
  }, [loop]);

  // Music page config
  const musicPlayer = useRef(null);
  const [durationValue, setDurationValue] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const [lyricsJson, setLyricsJson] = useState([]);
  // Lyrics processing
  useEffect(() => {
    if (localStorage.getItem('currentTrackLyrics') !== null) {
      const author = encodeURIComponent(localStorage.getItem('currentTrackAuthor').replace(/[^a-z0-9\s]/gi, '').toLowerCase());
      const title = encodeURIComponent(localStorage.getItem('currentTrackTitle').replace(/[^a-z0-9\s]/gi, '').toLowerCase());
      api.get(`/lyrics/${author}/${title}/${localStorage.getItem('currentTrack')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        localStorage.setItem('currentTrackLyrics', JSON.stringify(res.data.lyrics));
        api.post('/lyrics/gemini',
        {
          youtubeId: localStorage.getItem('currentTrack'),
          title: localStorage.getItem('currentTrackTitle'),
          author: localStorage.getItem('currentTrackAuthor'),
          thumbnail: localStorage.getItem('currentTrackThumbnail'),
          lyrics: res.data.lyrics.lyrics,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((res) => {
          localStorage.setItem('currentTrackInterpretation', res.data.interpretation);
        })
        .catch((err) => {
          console.log(err);
        });
      })
      .catch(() => {
        localStorage.setItem('currentTrackLyrics', JSON.stringify({ lyrics: [{ timestamp: 0, lyrics: 'No lyrics found!'}] }));
        localStorage.setItem('currentTrackInterpretation', 'No lyrics to be interpreted!');
      })
    }
  }, [currentTrack])
  // Interval: Lyrics display, duration, stats update
  useEffect(() => {
    const interval = setInterval(() => {
      if (!localStorage.getItem('currentTrack')) {
        return;
      }
      setDurationValue(Math.round(musicPlayer.current.getCurrentTime()));
      try {
        // Process lyrics
        if (localStorage.getItem('currentTrackLyrics')) {
          setLyricsJson(JSON.parse(localStorage.getItem('currentTrackLyrics')).lyrics)
        }
      } catch (error) {
        // Don't do anything, this is just preventing filling console with unnecessary error message
      }
    }, 1);
    return () => clearInterval(interval);
  }, [musicPlayer, durationValue]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (musicPlay === true && localStorage.getItem('currentTrack')) {
        const currentListeningTime = Number(localStorage.getItem('addListeningTime')) || 0;
        localStorage.setItem('addListeningTime', Math.round(currentListeningTime + 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [musicPlay]);

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
      <div className="bg-[#111] bg-cover bg-no-repeat bg-center w-screen h-screen">

        {page !== 'music' && (
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

            {/* Current track indicator */}
            {currentTrack && (
              <div className={`z-50 flex justify-between items-center fixed bottom-20 bg-[#212529] w-[95vw] mx-2 rounded-lg`}>
                <div onClick={()=>{setPage('music')}} className="hover:cursor-pointer flex items-center flex-grow">
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

            {/* Bottom navbar */}
            <div className="flex justify-between items-center px-4 fixed bottom-0 w-screen h-[70px] bg-[#111] border-t border-[#6C757D] z-50">
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
        )}

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

        {page === 'music' && (
          <div className="w-screen p-4 flex flex-col justify-center items-center">
            <div className="flex justify-start items-center text-center fixed top-0 w-screen p-8 bg-[#111] z-50">
              {/* Close */}
              <button className="btn btn-ghost" onClick={() => {setPage(previousPage)}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f9f9f9" className="bi bi-x" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </button>
            </div>
            <br />
            {/* Music info */}
            <div className="flex flex-col justify-center items-center h-[50vh] overflow-y-scroll">
              <div className="flex flex-col justify-center items-center text-center">
                <img src={localStorage.getItem('currentTrackThumbnail')} alt="Music cover" className="w-[160px] h-[160px] my-8 rounded-lg" />
                <div className="flex justify-center items-center text-center flex-wrap w-screen">
                  <div className="flex flex-col justify-center items-center text-center">
                    <h2 className="font-bold">{localStorage.getItem('currentTrackTitle')}</h2>
                    <p className="text-sm opacity-50">{localStorage.getItem('currentTrackAuthor')}</p>
                  </div>
                  <div className="hidden flex justify-center items-center">
                    <button className="flex justify-center items-center hover:cursor-pointer rounded-full bg-transparent p-2 border border-[#f9f9f9] hover:scale-90 transition duration-300" onClick={() => document.getElementById('interpretationModal').showModal()}>
                      <img src="Gemini.svg" alt="Gemini icon" className="w-[24px] h-[24px]" />
                    </button>
                    {/* Interpretation modal */}
                    <dialog id="interpretationModal" className="modal">
                      <div className="modal-box">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg flex items-center"><img src="Gemini.svg" alt="Gemini icon" className="w-[16px] h-[16px] me-1" />Summary</h3>
                          <form method="dialog">
                            <button className="btn btn-ghost">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f9f9" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                              </svg>
                            </button>
                          </form>
                        </div>
                        <div className="py-4">
                          <p className="text-sm text-justify">{localStorage.getItem('currentTrackInterpretation')}</p>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            </div>
            {/* Music control */}
            <div className="flex flex-col justify-center items-center text-center">
            <p className="text-sm mb-2">{DurationFormatting(durationValue === maxDuration - 1 ? maxDuration : durationValue)} - {DurationFormatting(maxDuration)}</p>
              <input type="range" name="duration" id="duration" min="0" max={maxDuration} value={durationValue}  onChange={(event) => {
                musicPlayer.current.seekTo(event.target.value);
                setMusicPlay(true);
              }} className="range range-xs [--range-shdw:#f9f9f9] w-[80vw]" />
              <div className="flex justify-between items-center w-screen px-4 my-4">
                <div>
                  {/* Loop */}
                  <button className="btn btn-ghost"><img src={`${loop ? 'Loop.svg' : 'Repeat.svg'}`} alt="Repeat/loop button" className="w-[24px] h-[24px]" onClick={() => setLoop(!loop)} /></button>
                </div>
                <div className="flex justify-center items-center">
                  {/* Previous track button */}
                  <button className="p-0 btn btn-ghost"><img src="Previous.svg" alt="Previous button" className="mx-1 w-[24px] h-[24px]" /></button>
                  {/* Play or pause button */}
                  <button className="p-0 btn btn-ghost"><img src={`${musicPlay ? 'Pause.svg' : 'Play.svg'}`} alt="Music cover" className="mx-2 w-[48px] h-[48px] rounded-lg hover:cursor-pointer" onClick={() => {
                    musicPlay === false ? setMusicPlay(true) : setMusicPlay(false)
                    durationValue === maxDuration ? localStorage.setItem('addMusicCount', localStorage.getItem('addMusicCount') ? Number(localStorage.getItem('addMusicCount')) + 1 : 1) : null
                  }} /></button>
                  {/* Next track button */}
                  <button className="p-0 btn btn-ghost"><img src="Next.svg" alt="Next button" className="mx-1 w-[24px] h-[24px]" /></button>
                </div>
                <div>
                  <button className="btn btn-ghost"><img src="AddToPlaylist.svg" alt="Add to playlist button" className="mx-1 w-[24px] h-[24px]" /></button>
                </div>
              </div>
            </div>
            {/* Lyrics */}
            <div className="flex justify-center items-center text-center bg-gradient-to-b from-[#1969F6] to-[#144082] m-4 p-2 rounded-[10px]">
              <table className="table">
                <thead className="border-b">
                  <tr className="border-0">
                    <th className="text-start text-[#f9f9f9] opacity-75">Lyrics</th>
                    <th className="text-end text-[#f9f9f9] opacity-75">Timestamps</th>
                  </tr>
                </thead>
                <tbody>
                  {lyricsJson.map((val, i) => {
                    if (val.lyrics !== "") {
                      return (
                        <tr className="border-0" key={i}>
                          <td className="text-start">{val.lyrics}</td>
                          <td className="text-end">{DurationFormatting(val.timestamp)}</td>
                        </tr>
                      )
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
    </>
  )
}
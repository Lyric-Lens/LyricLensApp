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
    if (!localStorage.getItem('history')) {
      api.get(`/users/${localStorage.getItem('userId')}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then((res) => {
        if (!res.data.user.history) {
          localStorage.setItem('history', JSON.stringify([]));
        } else {
          localStorage.setItem('history', JSON.stringify(res.data.user.history));
          location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }

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
  const [displayLyric, setDisplayLyric] = useState(false);
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
  // Interval: Lyrics display, duration
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
          lyricsJson.forEach((lyric, i) => {
            if (lyric.timestamp === durationValue) {
              setDisplayLyric(i);
            }
          })
        }
      } catch (error) {
        // Don't do anything, this is just preventing filling console with unnecessary error message
      }
    }, 1);
    return () => clearInterval(interval);
  }, [musicPlayer, durationValue, lyricsJson]);
  // Interval: Listening time, update stats schedule
  useEffect(() => {
    const interval = setInterval(() => {
      if (musicPlay === true && localStorage.getItem('currentTrack')) {
        const currentListeningTime = Number(localStorage.getItem('addListeningTime')) || 0;
        localStorage.setItem('addListeningTime', Math.round(currentListeningTime + 1));
      }
      if (!localStorage.getItem('updateStatsSchedule')) {
        localStorage.setItem('updateStatsSchedule', 0);
      }
      if (Number(localStorage.getItem('updateStatsSchedule')) <= 60) {
        localStorage.setItem('updateStatsSchedule', Number(localStorage.getItem('updateStatsSchedule')) + 1);
      } else {
        api.post(`/users/${localStorage.getItem('userId')}/stats`, {
          history: JSON.parse(localStorage.getItem('history')),
          listeningTime: Number(localStorage.getItem('addListeningTime')),
          musicCount: Number(localStorage.getItem('addMusicCount')),
          // TODO: playlistCount: Number(localStorage.getItem('addPlaylistCount')), // add when finished with playlist system
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(() => {
          localStorage.setItem('addListeningTime', 0);
          localStorage.setItem('addMusicCount', 0);
          // TODO: localStorage.setItem('addPlaylistCount', 0); // add when finished with playlist system
        })
        .catch((err) => {
          console.log(err);
        })
        localStorage.setItem('updateStatsSchedule', 0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [musicPlay]);
  useEffect(() => {})
  // Scroll to top visibility
  const [visibleScrollTop, setVisibleScrollTop] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setVisibleScrollTop(scrollY > 500);
    });
    return () => window.removeEventListener('scroll', () => {
      setVisibleScrollTop(scrollY > 500);
    });
  }, []);

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
      <div className="bg-cover bg-no-repeat bg-center w-screen h-screen">

        {page !== 'music' && (
          <>
            {/* Header - Search bar and settings */}
            <div className="flex justify-around items-center p-4">

              <img src="Logo.svg" alt="LyricLens logo as the background" className="-z-50 opacity-25 w-[280px] h-[280px] absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', }} />

              {/* Search bar */}
              <label className="input input-bordered flex items-center gap-2 rounded-full bg-[#212529]">
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
            <button className={`btn btn-ghost fixed bottom-8 right-4 z-50 ${visibleScrollTop ? 'pointer-events-auto' : 'pointer-events-none opacity-0'} transition duration-300`} onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}) }}>
              <img src="ScrollToTop.svg" alt="Scroll to top" className="w-[36px] h-[36px]" />
            </button>
            <div className="flex justify-between items-center w-screen px-8 py-4">
              {/* Close */}
              <button className="btn btn-ghost" onClick={() => {setPage(previousPage)}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f9f9f9" className="bi bi-x" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </button>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f9f9f9" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content -translate-x-12 bg-[#212529] menu p-2 rounded-md shadow">
                  <li>
                    <div className="flex justify-start items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f9f9" className="bi bi-share-fill" viewBox="0 0 16 16">
                        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
                      </svg>
                      Share
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-start items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f9f9" className="bi bi-flag-fill" viewBox="0 0 16 16">
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                      </svg>
                      Report
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <br />
            {/* Music info */}
            <div className="flex flex-col justify-center items-center mb-16">
              <div className="flex flex-col justify-center items-center text-center">
                <img src={localStorage.getItem('currentTrackThumbnail')} alt="Music cover" className="w-[160px] h-[160px] my-8 rounded-lg" />
                <div className="flex justify-center items-center text-center flex-wrap w-screen">
                  <div className="flex flex-col justify-center items-center text-center">
                    <h2 className="font-bold">{localStorage.getItem('currentTrackTitle')}</h2>
                    <p className="text-sm opacity-50">{localStorage.getItem('currentTrackAuthor')}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Music control */}
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-sm mb-2">{DurationFormatting(durationValue === maxDuration - 1 ? maxDuration : durationValue)} - {DurationFormatting(maxDuration)}</p>
              <div className="flex justify-center items-center relative">
                <input type="range" name="duration" id="duration" min="0" max={maxDuration} value={durationValue}  onChange={(event) => {
                  musicPlayer.current.seekTo(event.target.value);
                  setMusicPlay(true);
                }} className="range range-xs [--range-shdw:#f9f9f9] w-[80vw]" />
                <div className="w-[80vw] h-[1px] border rounded-full absolute opacity-50 pointer-events-none"></div>
              </div>
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
                    if (durationValue === maxDuration) {
                      localStorage.setItem('addMusicCount', localStorage.getItem('addMusicCount') ? Number(localStorage.getItem('addMusicCount')) + 1 : 1);
                    }
                  }} /></button>
                  {/* Next track button */}
                  <button className="p-0 btn btn-ghost"><img src="Next.svg" alt="Next button" className="mx-1 w-[24px] h-[24px]" /></button>
                </div>
                <div>
                  <button className="btn btn-ghost"><img src="AddToPlaylist.svg" alt="Add to playlist button" className="mx-1 w-[24px] h-[24px]" /></button>
                </div>
              </div>
            </div>
            {/* Summary */}
            <div className="flex justify-center items-center my-4">
              <button className="flex justify-center items-center hover:cursor-pointer rounded-full bg-transparent p-4 w-[80vw] bg-gradient-to-b from-[#1969F6] to-[#0152cc] hover:scale-90 transition duration-300" onClick={() => { document.getElementById('interpretationModal').showModal(); }}>
                <img src="Gemini.svg" alt="Gemini icon" className="w-[24px] h-[24px] me-2" /> Summary
              </button>
              {/* Interpretation modal */}
              <dialog id="interpretationModal" className="modal">
                <div className="modal-box">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center"><img src="Gemini.svg" alt="Gemini icon" className="w-[16px] h-[16px] me-2" />Summary</h3>
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
            {/* Lyrics */}
            <div className="flex justify-center items-center text-center bg-gradient-to-b from-[#1969F6] to-[#144082] m-4 p-2 rounded-[10px]">
              <table className="table w-[80vw]">
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
                          <td className={`text-start text-[#f9f9f9] ${i === displayLyric ? 'scale-110' : ''} transition duration-300`}>{i === displayLyric ? <b>{val.lyrics}</b> : val.lyrics}</td>
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
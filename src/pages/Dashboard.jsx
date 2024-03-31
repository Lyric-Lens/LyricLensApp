import { useEffect, useState, useRef } from "react"
import { api } from "../utils/API";
import Music from "../components/Music";

export default function Dashboard() {
  // Determine page: Home, Explore, Collection, Profile
  const [page, setPage] = useState(new URLSearchParams(window.location.search).get('page'));
  useEffect(() => {
    // Set default page
    if (!page) {
      window.location.search = '?page=home';
    }

    // Redirect on invalid page
    const routes = ['home', 'explore', 'collection', 'profile', 'search'];
    if (!routes.includes(page)) {
      window.location.search = '?page=home';
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
  const searchExecuted = useRef(false);
  useEffect(() => {
    if (search !== '') {
      window.location.search = `?page=search&search=${search}`
    }
  }, [search])
  useEffect(() => {
    if (searchExecuted.current) return;
    searchExecuted.current = true;

    let searchParams = new URLSearchParams(window.location.search).get('search');
    if (searchParams !== null) {
      api.post('/searchMusic', {
        search: searchParams
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then((res) => {
        setSearchResults(res.data.results);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      })
    }
  }, [])
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

      {/* Bottom navbar */}
      <div className="flex justify-between items-center px-4 fixed bottom-0 w-screen h-[70px] bg-[#111] border-t border-[#6C757D]">

        <div onClick={function() {window.location.search = `?page=home`}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={page === 'home' ? "HomeActive.svg" : "Home.svg"} alt="Home Page" className="w-[24px] h-[24px]" />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'home' ? '' : 'opacity-50'}`}>Home</p>
        </div>

        <div onClick={function() {window.location.search = `?page=explore`}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={page === 'explore' ? "ExploreActive.svg" : "Explore.svg"} alt="Explore Page" className="w-[24px] h-[24px]" />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'explore' ? '' : 'opacity-50'}`}>Explore</p>
        </div>

        <div onClick={function() {window.location.search = `?page=collection`}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={page === 'collection' ? "CollectionActive.svg" : "Collection.svg"} alt="Collection Page" className="w-[24px] h-[24px]" />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'collection' ? '' : 'opacity-50'}`}>Collection</p>
        </div>

        <div onClick={function() {window.location.search = `?page=profile`}} className="rounded-full btn btn-ghost flex flex-col justify-center items-center">
          <img src={photo || "UserPlaceholder.svg"} alt="Profile Page" className={`${page === 'profile' ? '' : 'opacity-50'} w-[24px] h-[24px]`} />
          <p style={{fontWeight: '200', fontSize: 'smaller'}} className={`${page === 'profile' ? '' : 'opacity-50'}`}>Profile</p>
        </div>

      </div>
    </>
  )
}
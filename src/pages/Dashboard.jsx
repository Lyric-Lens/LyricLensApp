import { useEffect, useState } from "react"
import { api } from "../utils/API";

export default function Dashboard() {
  // Determine page: Home, Explore, Collection, Profile
  const [page, setPage] = useState(new URLSearchParams(window.location.search).get('page'));
  useEffect(() => {
    // Set default page
    if (!page) {
      window.location.search = '?page=home';
    }

    // Redirect on invalid page
    const routes = ['home', 'explore', 'collection', 'profile'];
    if (!routes.includes(page)) {
      window.location.search = '?page=home';
    }
  }, [page]);

  // Get user's photo
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    api.get(`/users/${localStorage.getItem('email')}`, {
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
      {page === 'home' && (
      <>
      home
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

      {/* Bottom Navbar */}
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
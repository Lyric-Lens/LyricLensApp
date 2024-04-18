export default function Collection() {
  return (
    <>
      <div className="ms-4">
        <img src="Collectionimg.svg" className="float-right mt-1 w-[25px] me-8" />
        <h2 className="font-bold text-2xl ms-4 mb-2">Collections</h2>
        <div className="relative m-4 w-[140px] h-[140px] float-left">
          <img src="https://via.placeholder.com/150" className="absolute rounded-lg w-[100%]" alt="" />
          <p className="mt-[150px] text-center text-white font-bold">Favorites</p>
        </div>
        <div className="relative m-4 w-[140px] h-[140px] float-left">
          <img src="https://via.placeholder.com/150" className="absolute rounded-lg w-[100%]" alt="" />
          <p className="mt-[150px] text-center text-white font-bold">My Music</p>
        </div>
        <div className="relative mt-10 m-4 w-[140px] h-[140px] float-left">
          <img src="https://via.placeholder.com/150" className="absolute rounded-lg w-[100%]" alt="" />
          <p className="mt-[150px] text-center text-white font-bold">Cool Playlist 1</p>
        </div>
        <div className="relative mt-10 m-4 w-[140px] h-[140px] float-left">
          <img src="https://via.placeholder.com/150" className="absolute top-0 left-0 rounded-tl-lg w-[50%] h-[50%]" alt="" />
          <img src="https://via.placeholder.com/150" className="absolute top-0 right-0 rounded-tr-lg w-[50%] h-[50%]" alt="" />
          <img src="https://via.placeholder.com/150" className="absolute bottom-0 left-0 rounded-bl-lg w-[50%] h-[50%]" alt="" />
          <img src="https://via.placeholder.com/150" className="absolute bottom-0 right-0 rounded-br-lg w-[50%] h-[50%]" alt="" />
          <p className="mt-[150px] text-center text-white font-bold">Cool Playlist 2</p>
        </div>
      </div>
    </>
  )
}
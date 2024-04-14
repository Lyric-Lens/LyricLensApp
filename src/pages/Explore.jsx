export default function Explore() {
  return (
    <>
      <div className="m-4 bg-[#212529] shadow-lg rounded-lg p-6">
        <img src="https://via.placeholder.com/150" className="w-[100%] h-[150px]" alt="img" />
        <div style={{float: 'right'}} className="w-[40px] mt-4">
            <img src="Frame.svg" alt="playbutton" style={{width: '100%'}} />
        </div>
        <h2 className="text-white text-xl font-bold mt-2">Title - Author</h2>
        <p className="text-white text-xl mt-2">
            “This song tells the singer’s
            unwavering commitment
            to their partner.”
        </p>
      </div>
    </>
  )
}
import Music from "../components/Music";

export default function Explore() {
  return (
    <>
      <div className="ms-4">
        <h2 className="font-bold text-2xl ms-4 mb-2">Recommended for You</h2>
        {localStorage.getItem('history') && localStorage.getItem('history').length > 2 ? JSON.parse(localStorage.getItem('history')).map((val, i) => (
          <Music key={i} val={val.val} />
        )) : (<p className="ms-4">No music listened yet!</p>)}
      </div>
    </>
  )
}
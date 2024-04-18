export default function Profile() {
  return (
    <>
      {/* profile */}
      <h2 className="font-bold text-2xl ms-4 mb-2">Stats</h2>
      <div className="collapse collapse-arrow">
        <input type="radio" name="my-accordion-2" defaultChecked /> 
        <div className="collapse-title text-xl font-medium">
          <img src="" /> <b>Listening Time</b>: (72)h (12)m
        </div>
        <div className="collapse-content"> 
          <p>chart here</p>
        </div>
        <hr />
      </div>
      <div className="collapse collapse-arrow">
        <input type="radio" name="my-accordion-2" /> 
        <div className="collapse-title text-xl font-medium"> 
          <img src="" /> <b>Music Listened</b>: (6) Songs
        </div>
        <div className="collapse-content"> 
          <p>chart</p>
        </div>
        <hr />
      </div>
      <div className="collapse collapse-arrow">
        <input type="radio" name="my-accordion-2" /> 
        <div className="collapse-title text-xl font-medium">
          <img src="" /> <b>Playlist Created</b>: (3) Playlists
        </div>
        <div className="collapse-content"> 
          <p>chart</p>
        </div>
        <hr />
      </div>
      <div className="collapse collapse-arrow">
        <input type="radio" name="my-accordion-2" /> 
        <div className="collapse-title text-xl font-medium">
          <img src="" /> <b>Average Playlist Length</b>: (22)m/playlist
        </div>
        <div className="collapse-content"> 
          <p>chart</p>
        </div>
        <hr />
      </div>
    </>
  )
}
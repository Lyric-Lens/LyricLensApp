import Music from "../components/Music";

export default function Search(searchResults) {
  return (
    <>
      {/* Search results */}
      <div className="h-[75vh] overflow-y-scroll">
        {searchResults.searchResults.map((val, i) => (
          <Music key={i} val={val} />
        ))}
      </div>
    </>
  )
}
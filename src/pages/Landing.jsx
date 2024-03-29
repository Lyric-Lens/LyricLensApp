import { useState } from "react"

export default function Landing() {
  const [slide, setSlide] = useState(1);

  // Sublte onload animation
  const [onloadLogo, setOnloadLogo] = useState(false);
  const [onloadSlides, setOnloadSlides] = useState(false);
  const [onloadIndicator, setOnloadIndicator] = useState(false);
  const actions = [setOnloadLogo, setOnloadSlides, setOnloadIndicator];
  actions.forEach((setAction, i) => {
    setTimeout(() => { setAction(true); }, (i + 1) * 1000);
  });

  // Change slide functions
  function nextSlide() {
    if (slide < 4) {
      setSlide(slide + 1);
    }
  }
  function previousSlide() {
    if (slide > 1) {
      setSlide(slide - 1);
    }
  }
  return (
    <>
      <div className="flex flex-col justify-start items-center w-screen h-screen overflow-hidden bg-gradient-to-b from-[#111] via-[#111] via-75% to-[#0D6EFD]">

        {/* Logo */}
        <img id="logo" src="Logo.svg" alt="LyricLens Logo" className={`mb-48 w-[180px] h-[180px] transition duration-700 ${onloadLogo ? '' : 'opacity-0'}`} />

        {/* Slides */}
        <div className={`flex justify-center items-center transition duration-300 ${onloadSlides ? '' : 'opacity-0'}`}>

          {/* Previous arrow */}
          <img onClick={previousSlide} src="/PreviousArrow.svg" alt="Previous Arrow" className={`transition duration-500 w-[16px] h-[16px] hover:cursor-pointer me-4 ${slide === 1 ? 'opacity-0' : ''}`} />

          {/* Actual slides */}
          <div className="relative w-[250px]">

            {/* Slide 1 */}
            <div className={`absolute -top-48 flex justify-center items-center flex-col transition duration-300 ${slide === 1 ? '' : '-translate-x-[100vw]'}`}>
              <h1 className="text-4xl font-semibold self-start">Analyze</h1>
              <img src="/Slide1.svg" alt="A person listening to music with his headphone while looking at his phone, his expression seems melancholic." className="w-[250px] h-[250px] rounded-2xl mt-8 mb-4" />
              <p>Beyond the beat</p>
              <p>Explore the meaning of music</p>
            </div>

            {/* Slide 2 */}
            <div className={`absolute -top-48 flex justify-center items-center flex-col transition duration-300 ${slide === 2 ? '' : slide > 2 ? '-translate-x-[100vw]' : 'translate-x-[100vw]'}`}>
              <h1 className="text-4xl font-semibold self-start">Listen</h1>
              <img src="/Slide2.svg" alt="A person listening to music with his headphone while looking at his phone, his expression seems melancholic." className="w-[250px] h-[250px] rounded-2xl mt-8 mb-4" />
              <p>High quality music</p>
              <p>Always at your fingertips</p>
            </div>

            {/* Slide 3 */}
            <div className={`absolute -top-48 flex justify-center items-center flex-col transition duration-300 ${slide === 3 ? '' : slide > 3 ? '-translate-x-[100vw]' : 'translate-x-[100vw]'}`}>
              <h1 className="text-4xl font-semibold self-start">Collect</h1>
              <img src="/Slide3.svg" alt="A person listening to music with his headphone while looking at his phone, his expression seems melancholic." className="w-[250px] h-[250px] rounded-2xl mt-8 mb-4" />
              <p>Curate your music</p>
              <p>Build the perfect playlist</p>
            </div>

            {/* Slide 4 */}
            <div className={`absolute -top-48 flex justify-center items-center flex-col transition duration-300 ${slide === 4 ? '' : slide > 4 ? '-translate-x-[100vw]' : 'translate-x-[100vw]'}`}>
              <h1 className="text-4xl font-semibold self-start">Ready?</h1>
              <img src="/Slide4.svg" alt="A person listening to music with his headphone while looking at his phone, his expression seems melancholic." className="w-[250px] h-[250px] rounded-2xl mt-8 mb-4" />
              <p>Begin your journey</p>
              <p>Get started with LyricLens</p>
            </div>

          </div>

          {/* Next arrow */}
          <img onClick={nextSlide} src="/NextArrow.svg" alt="Next Arrow" className={`transition duration-300 w-[16px] h-[16px] hover:cursor-pointer ms-4 ${slide === 4 ? 'opacity-0' : ''}`} />

        </div>

        {/* Slide indicator */}
        <div className={`mt-64 transition duration-500 flex justify-center items-center ${onloadIndicator ? '' : 'opacity-0'} ${slide === 4 ? '-translate-y-4' : 'translate-y-12'}`}>
          <div className={`w-[8px] transition duration-300 h-[8px] mx-[2px] rounded-full border border-[#f9f9f9] ${slide === 1 ? 'bg-[#f9f9f9]' : ''}`}></div>
          <div className={`w-[8px] transition duration-300 h-[8px] mx-[2px] rounded-full border border-[#f9f9f9] ${slide === 2 ? 'bg-[#f9f9f9]' : ''}`}></div>
          <div className={`w-[8px] transition duration-300 h-[8px] mx-[2px] rounded-full border border-[#f9f9f9] ${slide === 3 ? 'bg-[#f9f9f9]' : ''}`}></div>
          <div className={`w-[8px] transition duration-300 h-[8px] mx-[2px] rounded-full border border-[#f9f9f9] ${slide === 4 ? 'bg-[#f9f9f9]' : ''}`}></div>
        </div>

        {/* Get started button */}
        <div className={`flex justify-center items-center transition duration-300 ${slide === 4 ? '' : 'opacity-0'}`}>
          <a href="/authentication" className="btn text-[#f9f9f9] hover:cursor-pointer py-4 px-16 rounded-full bg-transparent border border-[#f9f9f9]"><p>Get started</p></a>
        </div>
      </div>
    </>
  )
}
import { api } from "../utils/API";

export default function Authentication() {
  // EPAuthenticate -> Email and Password Authentication
  function EPAuthenticate(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    api.post('/authentication', {
      email: email,
      password: password
    })
    .then((response) => {
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('token', response.data.token);
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center w-screen h-screen overflow-hidden bg-gradient-to-b from-[#111] via-[#111] via-75% to-[#0D6EFD]">
        {/* Logo */}
        <img id="logo" src="Logo.svg" alt="LyricLens Logo" className={`w-[180px] h-[180px]`} />

        {/* Decoration */}
        <img src="Headphone.svg" alt="A headphone placed in the middle of the page, as a decoration" id="logo" className="w-[120px] h-[120px] my-12" />

        {/* Login Form */}
        <form onSubmit={EPAuthenticate} autoComplete="off" className="flex flex-col justify-center items-center">

          {/* Email */}
          <label className="input input-bordered flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#f9f9f9" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
            <input required autoComplete="off" type="text" className="grow" name="email" placeholder="Email" />
          </label>

          {/* Password */}
          <label className="input input-bordered flex items-center gap-2 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f9f9f9" className="bi bi-shield-lock-fill">
              <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5" />
            </svg>
            <input required autoComplete="new-password" type="password" name="password" className="grow" placeholder="Password" />
          </label>

          {/* Submit -- N.B: If email is registered, user will login. Else user will register. */}
          <input type="submit" value="Continue" className="btn text-[#f9f9f9] hover:cursor-pointer py-4 px-16 rounded-full bg-transparent border border-[#f9f9f9]" />

        </form>
      </div>
    </>
  )
}
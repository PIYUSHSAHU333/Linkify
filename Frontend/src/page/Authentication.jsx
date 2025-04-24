import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Authentication() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [error, setError] = useState("");
  const [formState, setFormState] = useState(0); //0 => sign-in & 1 =>sign-up
  const [message, setMessage] = useState("");
  const [snackbar, setSnackbar] = useState("");
  const [open, setOpen] = useState("");

  const authContext = useContext(AuthContext);
  const { handleRegister, handleLogin } = authContext;
  const handleAuth = async () => {
    try {
      if (formState === 0) {
        const result = await handleLogin(username, password);
        console.log(result);
        setMessage(result);
        setSnackbar("Login Successful");
        setTimeout(()=>{
          setSnackbar("")
        }, 5000)
        setError("");
        setPassword("");
        setusername("")
      }
      if (formState === 1) {
        const result = await handleRegister(username, name, password);
        console.log(result);
        setMessage(result);
        setSnackbar("User registered")
        setTimeout(()=>{
          setSnackbar("")
        }, 5000)
        setPassword("");
        setError("")
        setFormState(0)
      }
    } catch (err) {
      console.log(err, "<=error")
      console.log(err.response.data.message)
      setError(err.response.data.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState === 0) {
      if (!password.trim() || !username.trim()) {
        setSnackbar("username and password are required!");
        setTimeout(() => setSnackbar(""), 3000); // Hide after 3s
        return;
      }
    } else if (formState === 1) {
      if (!name.trim() || !password.trim() || !username.trim()) {
        setSnackbar("Email, password and username are required!");
        setTimeout(() => setSnackbar(""), 3000); // Hide after 3s
        return;
      }
    }
    handleAuth();
  };

  return (
    <div className="authentication text-center flex items-center justify-center h-screen">
      <form class="form_container">
        <div class="logo_container"></div>
        <div class={` title_container`}>
          {formState === 0 ? (
            <p class="title">Sigin to your Account</p>
          ) : (
            <p class="title">Signup</p>
          )}

          <span class="subtitle">
            Get started with our app and enjoy the experience. or{" "}
            <button
              className="underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                {
                  formState === 0 ? setFormState(1) : setFormState(0);
                }
              }}
            >
              {formState === 0 ? "Signup" : "Signin"}
            </button>
          </span>
        </div>
        <br />
        {formState === 1 ? (
          <div class="input_container">
            <label class="input_label" for="name_field">
              Name
            </label>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
            >
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#000000"
                d="M15.232 5.232l3.536 3.536"
              />
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#000000"
                d="M4 20h4l10.293-10.293a1 1 0 000-1.414l-2.586-2.586a1 1 0 00-1.414 0L4 16v4z"
              />
            </svg>
            <input
              placeholder="Full name"
              title="Inpit title"
              name="input-name"
              type="text"
              class="input_field"
              id="name_field"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        ) : (
          ""
        )}

        <div class="input_container">
          <label class="input_label" for="username_field">
            Username
          </label>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
          >
            <path
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z"
              stroke="#141B34"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 21c0-2.761 4.03-5 9-5s9 2.239 9 5"
              stroke="#141B34"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            placeholder="Username"
            title="Inpit title"
            name="input-name"
            type="text"
            class="input_field"
            id="username_field"
            onChange={(e) => setusername(e.target.value)}
            value={username}
          />
        </div>
        <div class="input_container">
          <label class="input_label" for="password_field">
            Password
          </label>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
          >
            <path
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#141B34"
              d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
            ></path>
            <path
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="1.5"
              stroke="#141B34"
              d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
            ></path>
            <path
              fill="#141B34"
              d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"
            ></path>
          </svg>
          <input
            placeholder="Password"
            title="Inpit title"
            name="input-name"
            type="password"
            class="input_field"
            id="password_field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p style={{ color: "red" }}>{error}</p>
        <button
          title="Sign In"
          type="submit"
          class="sign-in_btn"
          onClick={handleSubmit}
        >
          <span>{formState === 0 ? "Signin" : "Signup"}</span>
        </button>
        <div class="separator"></div>
      </form>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md shadow-md z-50">
          {snackbar}
        </div>
      )}
    </div>
  );
}

export default Authentication;

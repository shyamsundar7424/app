import React, { useRef, useContext } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../App";
import { storeInSession } from "../common/session";


const UserAuthForm = ({ type }) => {
   
   const authForm = useRef();

  let { userAuth:{access_token}, setUserAuth } = useContext(UserContext);
  
  console.log(access_token);
  const userAuthThroughServer = async (serverRoute, formData) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        
        storeInSession("user",JSON.stringify(data))
        setUserAuth(data)
      })
      .catch(({ response }) => {
        toast.error(response?.data?.error || "Something went wrong");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!authForm.current) return toast.error("Form reference is missing");

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let form = new FormData(authForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key.toLowerCase()] = value.trim();
    }

    let { fullname = "", email, password } = formData;

    if (!email) return toast.error("Email is required");
    if (!emailRegex.test(email)) return toast.error("Enter a valid Email");
    if (!passwordRegex.test(password)) {
      return toast.error("Password must be 6 to 20 characters long and contain at least one numeric digit, one uppercase, and one lowercase letter");
    }
    if (type !== "sign-in" && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters long");
    }

    userAuthThroughServer(serverRoute, formData);
  };

  return (
    access_token ? <Navigate to="/" /> :
      <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center">
          <Toaster />
          <form ref={authForm} className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-gelasio capitalize text-center mb-12">
              {type === "sign-in" ? "Welcome back" : "Join us today"}
            </h1>

            {type !== "sign-in" && (
              <InputBox name="fullname" type="text" placeholder="Full Name" icon="fi-rr-user" />
            )}

            <InputBox name="email" type="email" placeholder="Email" icon="fi-rr-envelope" />
            <InputBox name="password" type="password" placeholder="Password" icon="fi-rr-key" />

            <button className="btn-dark center mt-8" type="submit">
              {type.replace("-", " ")}
            </button>

            <div className="relative w-full flex items-center gap-2 my-8 opacity-50 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
              <img src={googleIcon} className="w-5" alt="Google Icon" />
              Continue with Google
            </button>

            {type === "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account?
                <Link to="/signup" className="underline text-black text-xl ml-1">
                  Join us today
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Already a member?
                <Link to="/signin" className="underline text-black text-xl ml-1">
                  Sign in here
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWrapper>
  );
};

export default UserAuthForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/hero.png";
import video from "../assets/vid.mp4";
import meaning from "../assets/meaning.png";
import positive from "../assets/positive.png";
import identify from "../assets/identify.png";

function HomeScreen() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const goToSignup = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate('/signup', { state: { email } }); // Pass email to Signup page
  };

  // Inline animation style for the custom bounce
  const bounceStyle = {
    animation: "bounce 8s ease 2s infinite forwards", // Custom animation
    display: "inline-block", // Ensures the animation behaves as expected
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      {/* Background Image */}
      <img
        src={homeImage}
        alt="Home Screen"
        className="bg-cover bg-center bg-fixed h-screen w-full m-0"
      />

      {/* Title "Tube Sentment" */}
      <div className="absolute top-[11rem] left-1/3 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-[4rem] font-bold">
          <span style={{ color: "black" }}>Smart</span>
          <span style={{ color: "rgb(202,0,42)", ...bounceStyle }}>Filter</span>
        </h1>
      </div>

      {/* Email Form */}
      <div className="absolute top-[15rem] left-[26rem] transform -translate-x-1/2 mt-10 text-center text-white px-4 items-center">
        <form className="flex items-center space-x-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-64 pl-4 pb-[3px] py-2 border-2 border-[#595959] rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={goToSignup}
            className="w-32 px-6 py-2 bg-[rgb(202,0,42)] text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Signup
          </button>
        </form>
      </div>

      {/* Video and Text 50/50 Layout */}
      <div className="flex w-full p-3">
        {/* Video Container - Taking 50% of the width */}
        <div className="w-1/2 ">
          <video
            className="w-[350rem]  max-w-[98%] object-cover"
            src={video} // Path to your video file
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Text Container - Taking 50% of the width */}
        <div className="w-1/2  bg-[rgb(202,0,42)]  items-center justify-center text-black p-4">
        <h1 className="text-[2.5rem] ml-[4rem] mt-[8rem] font-bold text-white">
  <span>Analyze comments with</span><br></br>
  <span>a single click!</span><br></br>
</h1>
<br></br>
<button
  onClick={goToSignup}
  className="w-64 px-8 py-3 ml-[4rem] bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
>
  Enjoy TubeSentiment Now
</button>


        </div>
      </div>
      <div className="mt-[1.5rem] font-bold text-[2rem]">
        <span>We empower you to <span className="text-[rgb(202,0,42)]">analyze</span>, <span className="text-[rgb(202,0,42)]">engage</span>,  </span>
        <br></br><span className="ml-[5.5rem]">and <span className="text-[rgb(202,0,42)]">grow</span> your channel..</span>
      </div>
<div>

</div>
<div className="font-light">
  <br />
  <span>Clarityze is the easiest way to analyze YouTube comments and audience sentiment</span>
  <br />
  <span></span>
  <span className="ml-[5rem]"> helping you measure engagement and uncover trends.</span>
</div>
<div className="w-1/3 bg-[rgb(202,0,42)] mt-[2rem] items-center justify-center text-white p-4">
  <span className="font-bold mt-[3rem]">MISSION</span>
  <br />
  <span className="font-light">Our mission is to help creators gain actionable insights from YouTube comments to boost engagement and grow their channels</span>
  <br />
  <br />
  <span className="font-bold">PROMISE</span>
  <br />
  <span className="font-light">We promise to deliver accurate, actionable insights from YouTube comments that help you understand your audience and drive meaningful engagement.</span>
  <br />
  <br />
  <span className="font-bold">VIBE</span>
  <br />
  <span className="font-light">At Clarityze, we transform comments into insights. We capture audience sentiment and redefine how you engage with your viewers.</span>
</div>
<div className="mt-[2rem]">
  <span className="ml-[0rem] mt-[5rem] font-bold  text-[2rem]">Why TubeSentiment?</span>

    </div>
  <div className="flex space-[1rem] mr-[10rem]">
<img
        src={meaning}
        alt="meaning"
        className="  h-[9rem] w-auto ml-[6rem]"
        />
      


<span className="mt-[3.5rem]  text-medium">Engage in meaningful <br></br>conversations
</span>
<img
        src={identify}
        alt="meaning"
        className="  h-[8rem] w-auto mt-[0.5rem] ml-[2rem]"
        />
<span className="mt-[3.5rem]  text-medium">Identify trends and  <br></br>audience preference
</span>
<img
        src={positive}
        alt="meaning"
        className="  h-[8rem] w-auto mt-[0.5rem] ml-[2.5rem]"
        />
<span className="mt-[3.5rem]  text-medium">Monitor and manage your <br></br>online reputation
</span> 

</div>
      {/* Inline Keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            25% {
              transform: translateY(-30px);
            }
            50% {
              transform: translateY(15px);
            }
            75% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </div>
  );
}

export default HomeScreen;

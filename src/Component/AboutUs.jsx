import React from "react";
import about from '../assets/about.png';
function AboutUs() {
  return (
    <div   className=""
    style={{
       // Lighter red with 60% opacity
    }}>
        <h1 className="mt-[4rem] ml-[43rem] font-bold text-[2rem] text-[rgb(202,0,42)] ">About Us</h1>
        <div className="flex">
            <img src={about} alt="about" className="h-[20rem] w-[30rem] ml-[5rem] " />
            <span className=" mt-[2rem] ml-[5rem] mr-[7rem]">Welcome to VibeVision, the YouTube comment analyzer designed to help you understand your audience better!

In the digital age, knowing how your audience feels about your content can make a huge difference. VibeVision gives you valuable insights into the comments section of your YouTube videos. By analyzing the tone and sentiment of comments, we help content creators, businesses, and marketers stay connected with their communities.

Whether you're a content creator looking to improve engagement or a brand looking to track audience perception, VibeVision is here to provide easy-to-understand feedback based on user comments.</span>
        </div>
    </div>
  );
}

export default AboutUs;

import React from "react";
import about from '../assets/about.png';
import aboutus from "../assets/aboutus.png"
function AboutUs() {
  return (
    <div   className=""
    style={{
       // Lighter red with 60% opacity
    }}>
      <div className="bg-red-600 h-[10rem] w-full">
        <span></span>
        <br></br>
        <h1 className=" ml-[50rem]  font-bold text-[2rem] text-white ">About Us</h1>
        </div>
        <div className="flex">
            <img src={about} alt="about" className="h-[25rem] mt-[8rem] w-[30rem] ml-[3rem] " />
            <div className="w-[50%] bg-white p-[35px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.09)] transition-all duration-300 -mt-[70px] mr-[40px] mb-[40px] ml-[2rem] p-[40px]">
              <span>Overview</span><br></br><br></br>
            <span className=" mt-[4rem] ">With the rise of social media platforms like YouTube and Twitter, these spaces have transformed into 
              hubs for sharing ideas, connecting with audiences, and fostering conversations. Millions of users leave comments daily, 
              expressing their thoughts and opinions, creating a wealth of valuable insights. However, the sheer volume of interactions makes
               it nearly impossible to manually analyze and extract meaning from the data. That’s where we come in. </span>
               <br></br>
               <br></br>
               <span>At SmartFilter, we’re committed to simplifying the way comments are analyzed. Our cutting-edge system leverages 
                advanced algorithms to predict sentiment—whether it’s positive, negative, or neutral—giving users a deeper understanding
                 of audience emotions. By providing actionable insights, we empower businesses, creators, and individuals to connect with
                  their communities on a more meaningful level.</span>
                 <br></br>
                 <br></br> <span>In addition to sentiment analysis, our platform ensures
                   that spam is detected and filtered out, promoting a clean and constructive environment for engagement. With SmartFilter, 
                   we aim to transform the overwhelming influx of comments into a manageable and insightful resource, helping you foster stronger
                    connections and create impactful conversations across social platforms.
</span>
<br></br><br></br>
<div className="flex ">
  <div><span className="font-bold text-[1rem] text-[rgb(202,0,42)] ">S</span><span className="mt-[1.1rem]">entiment</span>
  <br></br>
<span className="font-bold text-[1rem] text-[rgb(202,0,42)] ">M</span><span className="mt-[1.1rem]">onitoring</span>
<br></br>
<span className="font-bold text-[1rem] text-[rgb(202,0,42)] ">A</span><span className="mt-[1.1rem]">entiment</span>
<br></br>
<span className="font-bold text-[1rem] text-[rgb(202,0,42)] ">R</span><span className="mt-[1.1rem]">entiment</span>
<br></br>
<span className="font-bold text-[1rem] text-[rgb(202,0,42)] ">T</span><span className="mt-[1.1rem]">entiment</span> </div>
</div>
<div className="mb-[10rem] ">   
           <img src={aboutus} alt="about" className="h-[20rem]  w-30%  mr-[40px]  ml-[2rem]  " />
</div>
</div>
        </div>
    </div>
  );
}

export default AboutUs;

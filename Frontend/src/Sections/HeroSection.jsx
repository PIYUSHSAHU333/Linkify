import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Button from '@mui/material/Button';
function HeroSection() {
    return ( 
        <div className="HeroSection text-amber-100 flex flex-col items-center justify-center">
            <img src="/media/images/meetingBg.png" className='w-1/3' alt="" />
            <h1 className='text-6xl w-[650px] font-bold text-center '>Meet and collaborate in the <span className='text-[#AB1B9E]'> same room </span></h1>
            <p className='text-2xl w-1/2 font-medium text-center mt-2.5 text-gray-400'>Reliable video, clear audio, and seamless collaboration—built for teams, friends, and everything in between.</p>
            <div className='cta mt-11 flex justify-center items-center gap-12'>
               <Link to={"/home"}> <Button variant="contained" className='!bg-[#AB1B9E] !rounded-xl'>Get Started</Button> </Link>
                <Link className='hover:underline :hover:text-[#AB1B9E]'>Learn More <ArrowRightAltIcon/></Link>
            </div>
            <div className="meetingImg  min-h-screen border-[#AB1B9E] w-8/10 mt-5 mb-10">
                <img src="/media/images/MeetingInoffice.jpg" alt="" className='rounded' />
            </div>
        </div>
     );
}

export default HeroSection;
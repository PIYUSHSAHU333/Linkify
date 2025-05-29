import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Button from '@mui/material/Button';
import { AuthContext } from '../context/AuthContext';
function HeroSection() {
    const {userData} = useContext(AuthContext)
    return ( 
        <div className="HeroSection text-amber-100 z-20 flex flex-col items-center justify-center px-4 md:px-0">
            <img src="/media/images/meetingBg.png" className='w-2/3 md:w-1/3' alt="" />
            <h1 className='text-3xl md:text-6xl w-full md:w-[650px] font-bold text-center z-20 mt-4'>Meet and collaborate in the <span className='z-20 text-[#AB1B9E] typing-text'> same room</span></h1>
            <p className='text-lg md:text-2xl w-full md:w-1/2 font-medium text-center mt-2.5 text-gray-300 z-20'>Reliable video, clear audio, and seamless collaboration—built for teams, friends, and everything in between.</p>
            <div className='cta mt-8 md:mt-11 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12'>
                <div className="cta-glow"></div>
               <Link to={"/home"}> {userData ? <Button variant="contained" className='!bg-[#AB1B9E] z-20 !rounded-xl w-full md:w-auto'>Join meeting</Button> : <Button variant="contained" className='!bg-[#AB1B9E] z-20 !rounded-xl w-full md:w-auto'>Get Started</Button> } </Link>
                <Link className='hover:underline hover:text-[#AB1B9E] z-20 flex items-center'>Learn More <ArrowRightAltIcon/></Link>
            </div>
            <div className="meetingImg z-20 w-full md:w-8/10 mt-5 mb-10 px-4 md:px-0 border-4 border-[#AB1B9E] rounded-2xl">
                <img src="/media/images/MeetingInoffice.jpg" alt="" className='w-full h-auto rounded-xl' />
            </div>
        </div>
     );
}

export default HeroSection;
import React from 'react';

function NotFound() {
    return ( 
        <>
        <div className='min-h-screen homeComp flex flex-col justify-center items-center'>
        <h1 className="text-6xl font-bold text-[#ee63e2]">404 - Page Not Found</h1>
      <p className="mt-4 font-bold text-6xl text-white">The page you're looking for doesn't exist.</p>
        </div>
        
        </>
     );
}

export default NotFound;
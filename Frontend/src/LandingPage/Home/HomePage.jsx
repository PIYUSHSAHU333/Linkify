import React from 'react';
import Hero from './Hero';
import FeatureCards from './FeatureCards';
function HomePage() {
    return ( 
        
        <div className="container box-border w-full ">
        <Hero/>
        <FeatureCards />
        </div>
        
     );
}

export default HomePage;
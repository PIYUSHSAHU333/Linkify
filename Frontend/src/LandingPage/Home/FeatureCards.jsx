import React from 'react';
import Tooltip from './Tooltip';
import Card from './Card';
const FeatureCards = () => {
  return (
    <div className='ml-14'>
    
    <Tooltip />
    
    <div className='featureCards mt-5 ml-3 flex gap-20 justify-evenly flex-wrap '>
        <Card title1={"Video calls, safe and easy."} title2={"Secure Video Conferencing, Anytime"} title3={"Video confrencing"}/>
        <Card title1={"Screen peak"} title2={"Share your screen with just one touch"} title3={"Screen sharing"}/>
        <Card title1={"Share the Moment-Privately"} title2={"fully secure, always private"} title3={"protected presentation"}/>
        <Card title1={"Talk in Real-Time, No Delays!"} title2={"Connect and chat in real-time."} title3={"Messaging"}/>
        <Card title1={"Secure Your Meeting"} title2={"Secure Your Meeting with a Password"} title3={"Privacy"}/>
        <Card title1={"Hop In as a Guest!"} title2={"Guest access made simple & fast."} title3={"Join as a guest"} />
    </div>
    </div>
      );
}

export default FeatureCards;

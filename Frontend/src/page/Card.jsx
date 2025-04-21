import React from 'react';
import "./Card.css"

function Card({titile, body}) {
    return ( 
        <div className="info-card ">
  <div className="info-card-details">
    <p className="info-card-title">{titile}</p>
    <p className="info-card-body">{body}</p>
  </div>
  <button class="info-card-button">Linkify</button>
</div>
     );
}

export default Card;
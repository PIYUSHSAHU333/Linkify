import React from "react";

function Card({title1, title2, title3}) {
  return (
    <>
      <div class="card">
  <div class="banner">
    <span class="banner-text">SIGNUP</span>
    <span class="banner-text">JOIN NOW</span>
  </div>
  <span class="card__title">{title1}</span>
  <p class="card__subtitle">{title2}</p>
  <form class="card__form">
    
    <button class="sign-up">{title3}</button>
  </form>
</div>
    </>
  );
}

export default Card;

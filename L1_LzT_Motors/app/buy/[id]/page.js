"use client";
import {use, useState} from "react";
import cars from "../../../data.json";
import Header from "../../components/Header";

export default function BuyPage({params}){
  const {id}=use(params);
  const car=cars.find(c=>c.id===Number(id));
  const [sent,setSent]=useState(false);
  if(!car) return <main><Header/><div className="notFound"><h1>Vehicle not found.</h1><a className="goldBtn" href="/">Back to collection</a></div></main>;
  return <main><Header/>
    <section className="buyPage">
      <div className="buyVisual"><img src={car.image} alt=""/><div className="buyBadge">L1 LzT VERIFIED</div></div>
      <div className="buyInfo"><p className="eyebrow">PURCHASE / {car.brand}</p><h1>{car.model}</h1><div className="buyPrice">${car.price.toLocaleString()}</div><div className="buySpecs"><span>{car.year}</span><span>{car.mileage.toLocaleString()} km</span><span>{car.fuel}</span><span>{car.transmission}</span></div>
      <p className="muted">Complete the inquiry below. A L1 LzT Motors consultant will contact you to confirm availability, inspection and purchase details.</p>
      {sent ? <div className="successBox"><b>Inquiry received ✓</b><span>Our consultant will contact you shortly.</span><a href="/" className="ghostBtn">Return to collection</a></div> : <form className="buyForm" onSubmit={e=>{e.preventDefault();setSent(true)}}><input required placeholder="Full name"/><input required placeholder="Phone number"/><input required type="email" placeholder="Email address"/><select><option>Preferred contact</option><option>Phone</option><option>Telegram</option><option>Email</option></select><button className="goldBtn">Request to Buy →</button></form>}
      </div>
    </section>
  </main>
}

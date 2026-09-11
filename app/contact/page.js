"use client";
import {useState} from "react";
import Navbar from "../components/Navbar";

export default function Contact(){
  const [sent,setSent]=useState(false);
  return <main className="contactPage">
    <Navbar active="contact" />
    <section className="contactHero">
      <div data-reveal><p className="eyebrow">L1 LZT / CONTACT</p><h1>Let's talk<br/><em>motors.</em></h1><p className="heroText">Looking for a specific vehicle, a private viewing or simply want to talk cars? Our team is ready.</p></div>
      <div className="contactCards" data-reveal>
        <div><span>SHOWROOM</span><b>Tashkent, Uzbekistan</b><p>Amir Temur Avenue · By appointment</p></div>
        <div><span>PHONE</span><b>+998 90 000 00 00</b><p>Mon–Sat · 09:00–20:00</p></div>
        <div><span>EMAIL</span><b>hello@l1lzt.uz</b><p>We reply within one business day.</p></div>
      </div>
    </section>
    <section className="contactSection">
      <div><p className="eyebrow">PRIVATE INQUIRY</p><h2>Tell us what<br/><em>you need.</em></h2></div>
      <form className="contactForm" onSubmit={e=>{e.preventDefault();setSent(true)}}>
        <input required placeholder="Your name"/>
        <input required type="email" placeholder="Email address"/>
        <input placeholder="Phone number"/>
        <select><option>I'm interested in...</option><option>Buying a vehicle</option><option>Private viewing</option><option>Selling a vehicle</option><option>General question</option></select>
        <textarea required placeholder="Tell us about your dream car..." rows="6"/>
        <button className="goldBtn">{sent ? "Message sent ✓" : "Send inquiry →"}</button>
      </form>
    </section>
    <footer><div className="logo"><span>L1</span> LzT <b>Motors</b></div><p>Luxury without compromise.</p><small>© 2026 L1 LzT Motors</small></footer>
  </main>
}
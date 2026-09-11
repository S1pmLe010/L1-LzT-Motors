"use client";
import {useEffect,useState} from "react";

export default function Header({onGarage, count=0}){
  const [theme,setTheme]=useState("dark");
  const [lang,setLang]=useState("EN");
  useEffect(()=>{
    const t=localStorage.getItem("lzt-theme")||"dark"; const l=localStorage.getItem("lzt-lang")||"EN";
    setTheme(t);setLang(l);document.documentElement.dataset.theme=t;
  },[]);
  const toggleTheme=()=>{const n=theme==="dark"?"light":"dark";setTheme(n);localStorage.setItem("lzt-theme",n);document.documentElement.dataset.theme=n};
  const toggleLang=()=>{const n=lang==="EN"?"UZ":"EN";setLang(n);localStorage.setItem("lzt-lang",n);window.dispatchEvent(new CustomEvent("lzt-lang",{detail:n}))};
  return <nav className="nav">
    <a href="/" className="logo"><span>L1</span> LzT <b>Motors</b></a>
    <div className="navlinks"><a href="/#home">Home</a><a href="/#inventory">Inventory</a><a href="/#about">About</a><a href="/contact">Contact</a></div>
    <div className="navActions"><button className="iconBtn" onClick={toggleTheme} title="Theme">{theme==="dark"?"☼":"☾"}</button><button className="langBtn" onClick={toggleLang}>{lang}</button><button className="garage" onClick={onGarage}>Garage <i>{count}</i></button></div>
  </nav>
}

"use client";
import Link from "next/link";
import {useEffect,useState} from "react";

export default function Navbar({active="home"}){
  const [open,setOpen]=useState(false);
  const [theme,setTheme]=useState("dark");
  const [lang,setLang]=useState("EN");
  useEffect(()=>{
    const saved=localStorage.getItem("lzt-theme")||"dark";
    setTheme(saved); document.documentElement.dataset.theme=saved;
  },[]);
  function toggleTheme(){
    const next=theme==="dark"?"light":"dark"; setTheme(next); localStorage.setItem("lzt-theme",next); document.documentElement.dataset.theme=next;
  }
  const labels={EN:["Home","Inventory","About","Contact"],UZ:["Bosh sahifa","Avtomobillar","Biz haqimizda","Aloqa"],RU:["Главная","Авто","О нас","Контакты"]}[lang];
  return <nav className="nav">
    <Link className="logo" href="/"><span>L1</span> LzT <b>Motors</b></Link>
    <button className="mobileMenu" onClick={()=>setOpen(!open)} aria-label="Menu"><i></i><i></i><i></i></button>
    <div className={`navlinks ${open?"open":""}`}>
      <Link className={active==="home"?"activeRoute":""} onClick={()=>setOpen(false)} href="/">{labels[0]}</Link>
      <Link className={active==="inventory"?"activeRoute":""} onClick={()=>setOpen(false)} href="/#inventory">{labels[1]}</Link>
      <Link className={active==="about"?"activeRoute":""} onClick={()=>setOpen(false)} href="/#about">{labels[2]}</Link>
      <Link className={`contactRoute ${active==="contact"?"activeRoute":""}`} onClick={()=>setOpen(false)} href="/contact">{labels[3]}</Link>
    </div>
    <div className="navActions">
      <button className="themeBtn" onClick={toggleTheme}>{theme==="dark"?"☀":"☾"}</button>
      <div className="langSwitch">{["UZ","RU","EN"].map(x=><button className={lang===x?"selectedLang":""} key={x} onClick={()=>setLang(x)}>{x}</button>)}</div>
    </div>
  </nav>
}

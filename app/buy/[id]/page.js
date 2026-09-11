"use client";
import {useState} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import cars from "../../../data.json";
import Navbar from "../../components/Navbar";
const money=n=>"$"+Number(n).toLocaleString("en-US");
export default function Buy(){
 const {id}=useParams(); const car=cars.find(x=>String(x.id)===String(id)); const [done,setDone]=useState(false);
 if(!car)return <><Navbar/><main className="notFound"><h1>Vehicle not found</h1><Link className="goldBtn" href="/">Back to collection</Link></main></>;
 return <main className="buyPage"><Navbar active="inventory"/><section className="buyWrap"><div className="buyImage"><img src={car.image} alt={car.model}/></div><div className="buyCard"><p className="eyebrow">L1 LZT / PURCHASE</p><h1>{car.brand}<br/><em>{car.model}</em></h1><div className="buyPrice">{money(car.price)}</div><div className="buySpecs"><span>{car.year}</span><span>{car.mileage.toLocaleString()} km</span><span>{car.transmission}</span><span>{car.fuel}</span></div>{done?<div className="successBox"><b>Inquiry received ✓</b><p>Our showroom team will contact you to confirm the purchase details.</p><Link href="/" className="ghostBtn">Back to collection</Link></div>:<form onSubmit={e=>{e.preventDefault();setDone(true)}} className="buyForm"><input required placeholder="Full name"/><input required type="tel" placeholder="Phone number"/><input required type="email" placeholder="Email"/><select><option>Payment method</option><option>Bank transfer</option><option>Financing</option><option>Cash</option></select><button className="goldBtn">Request to buy →</button></form>}<Link href="/" className="backLink">← Back to vehicles</Link></div></section></main>
}
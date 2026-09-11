"use client";

import { useEffect, useMemo, useState } from "react";

import carData from "../data.json";
import Navbar from "./components/Navbar";

const initialCars = carData;

const money = (n) => "$" + Number(n).toLocaleString("en-US");

export default function Home() {
  const [cars, setCars] = useState(initialCars);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setAdmin(v => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [cars, admin]);

  const brands = ["All", ...new Set(cars.map(c => c.brand))];

  const filtered = useMemo(() => {
    let list = cars.filter(c => {
      const q = search.toLowerCase();
      return (!q || `${c.brand} ${c.model}`.toLowerCase().includes(q)) &&
        (brand === "All" || c.brand === brand);
    });
    if (sort === "price-low") list.sort((a,b) => a.price-b.price);
    if (sort === "price-high") list.sort((a,b) => b.price-a.price);
    if (sort === "year") list.sort((a,b) => b.year-a.year);
    if (sort === "featured") list.sort((a,b) => Number(b.featured)-Number(a.featured));
    return list;
  }, [cars, search, brand, sort]);

  function notify(text) {
    setToast(text);
    setTimeout(() => setToast(""), 2200);
  }

  function addCart(car) {
    if (!cart.find(x => x.id === car.id)) {
      setCart([...cart, car]);
      notify(`${car.brand} ${car.model} added to garage`);
    } else notify("This car is already in your garage");
  }

  function deleteCar(id) {
    setCars(cars.filter(c => c.id !== id));
    notify("Vehicle removed");
  }

  function saveCar(data) {
    if (modal === "add") setCars([...cars, { ...data, id: Date.now() }]);
    if (modal?.type === "edit") setCars(cars.map(c => c.id === modal.id ? { ...data, id: c.id } : c));
    setModal(null);
    notify("Vehicle saved successfully");
  }

  return (
    <main>
      <Navbar active="home" />

      <section id="home" className="hero">
        <div className="heroGlow" />
        <div className="heroContent" data-reveal>
          <p className="eyebrow">L1 LzT MOTORS / EST. 2026</p>
          <h1>Drive the <em>extraordinary.</em></h1>
          <p className="heroText">A curated collection of performance, luxury and legendary automobiles.</p>
          <div className="heroButtons"><a className="goldBtn" href="#inventory">Explore Collection</a><a className="ghostBtn" href="#about">Our Story ↗</a></div>
        </div>
        <div className="heroStats" data-reveal><div><strong>06</strong><span>Vehicles</span></div><div><strong>24/7</strong><span>Support</span></div><div><strong>100%</strong><span>Verified</span></div></div>
      </section>

      <section id="inventory" className="inventory section">
        <div className="sectionHead" data-reveal>
          <div><p className="eyebrow">THE COLLECTION</p><h2>Find your <em>next legend.</em></h2></div>
          <p className="muted">Every vehicle is carefully inspected and selected for the L1 LzT collection.</p>
        </div>

        <div className="filters" data-reveal>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search model or brand..." />
          <select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(x=><option key={x}>{x}</option>)}</select>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="featured">Featured</option><option value="price-low">Price: Low → High</option><option value="price-high">Price: High → Low</option><option value="year">Newest</option>
          </select>
        </div>

        <div className="grid">
          {filtered.map((car, i) => <article className="carCard" data-reveal key={car.id} style={{"--delay": `${i*70}ms`}}>
            <div className="carImage"><img src={car.image} alt={`${car.brand} ${car.model}`} /><span>{car.featured ? "FEATURED" : car.year}</span><button onClick={()=>setSelected(car)}>View ↗</button></div>
            <div className="carBody"><div><small>{car.brand} / {car.year}</small><h3>{car.model}</h3></div><strong>{money(car.price)}</strong></div>
            <div className="specs"><span>{car.mileage.toLocaleString()} km</span><span>{car.transmission}</span><span>{car.fuel}</span></div>
            <button className="addBtn" onClick={()=>addCart(car)}>Add to Garage +</button>
          </article>)}
        </div>
      </section>

      <section id="about" className="manifesto section">
        <div className="manifestoBg">LZT</div>
        <div data-reveal><p className="eyebrow">WHY L1 LZT</p><h2>Not just a car.<br/><em>A statement.</em></h2><p className="manifestoText">We believe the right automobile changes more than your journey. It changes how you arrive, how you feel and how the world sees you.</p></div>
        <div className="values" data-reveal><div><b>01</b><span>Curated<br/>Selection</span></div><div><b>02</b><span>Verified<br/>Condition</span></div><div><b>03</b><span>Premium<br/>Service</span></div></div>
      </section>

      <footer><div className="logo"><span>L1</span> LzT <b>Motors</b></div><p>Luxury without compromise.</p><small>© 2026 L1 LzT Motors</small></footer>

      {selected && <div className="overlay" onClick={()=>setSelected(null)}><div className="detail" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><img src={selected.image}/><div><p className="eyebrow">{selected.brand} / {selected.year}</p><h2>{selected.model}</h2><strong className="detailPrice">{money(selected.price)}</strong><p>{selected.mileage.toLocaleString()} km · {selected.fuel} · {selected.transmission} · {selected.color}</p><p>{selected.location}</p><div className="detailActions"><button className="goldBtn" onClick={()=>{addCart(selected);setSelected(null)}}>Add to Garage</button><a className="buyBtn" href={`/buy/${selected.id}`}>Buy now →</a></div></div></div></div>}

      {modal === "cart" && <div className="overlay" onClick={()=>setModal(null)}><div className="panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setModal(null)}>×</button><p className="eyebrow">YOUR GARAGE</p><h2>Saved vehicles</h2>{cart.length ? cart.map(c=><div className="cartRow" key={c.id}><img src={c.image}/><div><b>{c.brand} {c.model}</b><span>{money(c.price)}</span></div><button onClick={()=>setCart(cart.filter(x=>x.id!==c.id))}>Remove</button></div>) : <p className="muted">Your garage is empty.</p>}</div></div>}

      {admin && <Admin cars={cars} setCars={setCars} onAdd={()=>setModal("add")} onEdit={id=>setModal({type:"edit",id})} onDelete={deleteCar} onClose={()=>setAdmin(false)} />}

      {(modal === "add" || modal?.type === "edit") && <CarForm initial={modal==="add" ? null : cars.find(c=>c.id===modal.id)} onSave={saveCar} onClose={()=>setModal(null)} />}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function Admin({cars,onAdd,onEdit,onDelete,onClose}) {
  const [tab,setTab]=useState("overview");
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("all");
  const [confirm,setConfirm]=useState(null);
  const filtered=cars.filter(c=>
    `${c.brand} ${c.model}`.toLowerCase().includes(query.toLowerCase()) &&
    (filter==="all" || (filter==="featured" && c.featured) || (filter==="petrol" && c.fuel==="Petrol") || (filter==="electric" && c.fuel==="Electric"))
  );
  const total=cars.reduce((s,c)=>s+c.price,0);
  return <div className="admin">
    <div className="adminTop">
      <div><p className="eyebrow">CONTROL CENTER / CTRL + ALT + B</p><h2>Admin <em>Dashboard</em></h2></div>
      <button className="ghostBtn" onClick={onClose}>Exit Admin</button>
    </div>
    <div className="adminNav">
      {["overview","inventory","analytics"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}
    </div>
    {tab==="overview" && <div data-reveal className="dashboardGrid">
      <div className="adminStats">
        <div><b>{cars.length}</b><span>Total Vehicles</span><small>+{cars.length} in catalog</small></div>
        <div><b>{cars.filter(c=>c.featured).length}</b><span>Featured</span><small>Premium picks</small></div>
        <div><b>{money(total)}</b><span>Inventory Value</span><small>Current asking prices</small></div>
        <div><b>{new Set(cars.map(c=>c.brand)).size}</b><span>Brands</span><small>Across the collection</small></div>
      </div>
      <div className="adminQuick"><p className="eyebrow">QUICK ACTIONS</p><button className="goldBtn" onClick={onAdd}>+ Add Vehicle</button><button className="ghostBtn" onClick={()=>setTab("inventory")}>Manage Inventory</button><div className="shortcut"><b>CTRL + ALT + B</b><span>Toggle admin panel anytime</span></div></div>
    </div>}
    {tab==="inventory" && <div data-reveal className="inventoryAdmin">
      <div className="adminTools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search inventory..."/><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All vehicles</option><option value="featured">Featured</option><option value="petrol">Petrol</option><option value="electric">Electric</option></select><button className="goldBtn" onClick={onAdd}>+ Add</button></div>
      <div className="adminTable">{filtered.map(c=><div className="adminRow" key={c.id}><img src={c.image}/><div><b>{c.brand} {c.model}</b><span>{c.year} · {money(c.price)} · {c.location}</span></div><label className="stockPill">{c.featured?"FEATURED":"ACTIVE"}</label><button onClick={()=>onEdit(c.id)}>Edit</button><button className="danger" onClick={()=>setConfirm(c.id)}>Delete</button></div>)}</div>
    </div>}
    {tab==="analytics" && <div className="analytics" data-reveal>
      <div className="analyticsCard"><p className="eyebrow">PRICE RANGE</p><h3>{money(Math.min(...cars.map(c=>c.price)))} — {money(Math.max(...cars.map(c=>c.price)))}</h3><div className="bars">{cars.slice().sort((a,b)=>b.price-a.price).slice(0,8).map(c=><div key={c.id} style={{"--w":`${Math.max(12,c.price/Math.max(...cars.map(x=>x.price))*100)}%`}}><span>{c.brand}</span><i/></div>)}</div></div>
      <div className="analyticsCard"><p className="eyebrow">FUEL MIX</p><h3>{[...new Set(cars.map(c=>c.fuel))].join(" · ")}</h3><p className="muted">Petrol: {cars.filter(c=>c.fuel==="Petrol").length} · Hybrid: {cars.filter(c=>c.fuel==="Hybrid").length} · Electric: {cars.filter(c=>c.fuel==="Electric").length}</p></div>
    </div>}
    {confirm && <div className="confirm"><div><p className="eyebrow">CONFIRM ACTION</p><h3>Remove this vehicle?</h3><p className="muted">This removes it from the current catalog.</p><button className="dangerBtn" onClick={()=>{onDelete(confirm);setConfirm(null)}}>Delete Vehicle</button><button className="ghostBtn" onClick={()=>setConfirm(null)}>Cancel</button></div></div>}
  </div>
}
function CarForm({initial,onSave,onClose}) {
  const [form,setForm]=useState(initial || {brand:"BMW",model:"",year:2026,price:0,mileage:0,fuel:"Petrol",transmission:"Automatic",color:"Black",location:"Tashkent",featured:false,image:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d9?q=85&w=1600&auto=format&fit=crop"});
  const set=(k,v)=>setForm({...form,[k]:v});
  return <div className="overlay"><div className="form"><button className="close" onClick={onClose}>×</button><p className="eyebrow">VEHICLE EDITOR</p><h2>{initial?"Edit":"Add"} <em>Vehicle</em></h2><div className="formGrid">{["brand","model","year","price","mileage","fuel","transmission","color","location","image"].map(k=><label key={k}>{k}<input value={form[k]} onChange={e=>set(k,["year","price","mileage"].includes(k)?Number(e.target.value):e.target.value)}/></label>)}<label className="check"><input type="checkbox" checked={form.featured} onChange={e=>set("featured",e.target.checked)}/> Featured</label></div><button className="goldBtn" onClick={()=>onSave(form)}>Save Vehicle</button></div></div>
}
"use client";

import { useEffect, useMemo, useState } from "react";
import carsSeed from "../data.json";
import Header from "./components/Header";

const money = (n) => "$" + Number(n).toLocaleString("en-US");

export default function Home() {
    const [cars, setCars] = useState(carsSeed);
    const [visible, setVisible] = useState(6);
    const [search, setSearch] = useState("");
    const [brand, setBrand] = useState("All");
    const [sort, setSort] = useState("featured");
    const [garage, setGarage] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState("");
    const [lang, setLang] = useState("EN");

    /* ================= SHORTCUT + LANGUAGE ================= */

    useEffect(() => {
        const k = (e) => {
            if (
                e.ctrlKey &&
                e.altKey &&
                e.key.toLowerCase() === "b"
            ) {
                e.preventDefault();
                setAdmin((v) => !v);
            }
        };

        window.addEventListener("keydown", k);

        const l = () => {
            setLang(localStorage.getItem("lzt-lang") || "EN");
        };

        window.addEventListener("lzt-lang", l);

        l();

        return () => {
            window.removeEventListener("keydown", k);
            window.removeEventListener("lzt-lang", l);
        };
    }, []);

    /* ================= REVEAL ANIMATION ================= */

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            {
                threshold: 0.08,
            }
        );

        document
            .querySelectorAll("[data-reveal]")
            .forEach((x) => obs.observe(x));

        return () => obs.disconnect();
    }, [visible, admin, cars]);

    /* ================= BRANDS ================= */

    const brands = [
        "All",
        ...new Set(cars.map((c) => c.brand)),
    ];

    /* ================= FILTER + SORT ================= */

    const filtered = useMemo(() => {
        let a = cars.filter((c) => {
            const q = search.toLowerCase();

            return (
                (!q ||
                    `${c.brand} ${c.model}`
                        .toLowerCase()
                        .includes(q)) &&
                (brand === "All" || c.brand === brand)
            );
        });

        if (sort === "price-low") {
            a.sort((x, y) => x.price - y.price);
        }

        if (sort === "price-high") {
            a.sort((x, y) => y.price - x.price);
        }

        if (sort === "year") {
            a.sort((x, y) => y.year - x.year);
        }

        if (sort === "featured") {
            a.sort(
                (x, y) =>
                    Number(y.featured) -
                    Number(x.featured)
            );
        }

        return a;
    }, [cars, search, brand, sort]);

    /* ================= TOAST ================= */

    const notify = (t) => {
        setToast(t);

        setTimeout(() => {
            setToast("");
        }, 1800);
    };

    /* ================= GARAGE ================= */

    const add = (c) => {
        if (!garage.some((x) => x.id === c.id)) {
            setGarage([...garage, c]);
            notify("Added to garage ✓");
        } else {
            notify("Already in garage");
        }
    };

    /* ================= SAVE VEHICLE ================= */

    const save = (data) => {
        if (modal === "add") {
            setCars([
                ...cars,
                {
                    ...data,
                    id: Date.now(),
                },
            ]);
        } else {
            setCars(
                cars.map((c) =>
                    c.id === modal.id
                        ? {
                              ...data,
                              id: c.id,
                          }
                        : c
                )
            );
        }

        setModal(null);
        notify("Vehicle saved ✓");
    };

    /* ================= LANGUAGES ================= */

    const text =
        lang === "UZ"
            ? {
                  hero: "G‘ayrioddiy avtomobilni haydang.",
                  explore: "Kolleksiyani ko‘rish",
                  collection: "KOLLEKSIYA",
                  find: "Keyingi afsonangizni toping.",
                  more: "Ko‘proq ko‘rish",
                  about: "Faqat avtomobil emas. Bu — bayonot.",
              }
            : {
                  hero: "Drive the extraordinary.",
                  explore: "Explore Collection",
                  collection: "THE COLLECTION",
                  find: "Find your next legend.",
                  more: "Load more",
                  about: "Not just a car. A statement.",
              };

    return (
        <main>

            {/* ================= HEADER ================= */}

            <Header
                onGarage={() => setModal("garage")}
                count={garage.length}
            />

            {/* ================= HERO ================= */}

            <section
                id="home"
                className="hero"
            >
                <div className="heroBackdrop" />
                <div className="heroGrid" />

                <div
                    className="heroContent"
                    data-reveal
                >
                    <p className="eyebrow">
                        L1 LzT MOTORS / EST. 2026
                    </p>

                    <h1>
                        {text.hero
                            .split(" ")
                            .slice(0, 2)
                            .join(" ")}{" "}
                        <em>
                            {text.hero
                                .split(" ")
                                .slice(2)
                                .join(" ")}
                        </em>
                    </h1>

                    <p className="heroText">
                        A private collection of performance,
                        luxury and legendary automobiles.
                    </p>

                    <div className="heroButtons">
                        <a
                            className="goldBtn"
                            href="#inventory"
                        >
                            {text.explore}
                        </a>

                        <a
                            className="ghostBtn"
                            href="/contact"
                        >
                            Contact ↗
                        </a>
                    </div>
                </div>

                <div
                    className="heroStats"
                    data-reveal
                >
                    <div>
                        <b>{cars.length}+</b>
                        <span>Vehicles</span>
                    </div>

                    <div>
                        <b>12</b>
                        <span>Brands</span>
                    </div>

                    <div>
                        <b>100%</b>
                        <span>Verified</span>
                    </div>
                </div>
            </section>

            {/* ================= INVENTORY ================= */}

            <section
                id="inventory"
                className="section"
            >
                <div
                    className="sectionHead"
                    data-reveal
                >
                    <div>
                        <p className="eyebrow">
                            {text.collection}
                        </p>

                        <h2>
                            {text.find
                                .split(" ")
                                .slice(0, -2)
                                .join(" ")}{" "}
                            <em>
                                {text.find
                                    .split(" ")
                                    .slice(-2)
                                    .join(" ")}
                            </em>
                        </h2>
                    </div>

                    <p className="muted">
                        Every vehicle is selected,
                        inspected and presented with
                        complete specifications.
                    </p>
                </div>

                {/* ================= FILTERS ================= */}

                <div
                    className="filters"
                    data-reveal
                >
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setVisible(6);
                        }}
                        placeholder="Search brand or model..."
                    />

                    <select
                        value={brand}
                        onChange={(e) => {
                            setBrand(e.target.value);
                            setVisible(6);
                        }}
                    >
                        {brands.map((x) => (
                            <option
                                key={x}
                                value={x}
                            >
                                {x}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) =>
                            setSort(e.target.value)
                        }
                    >
                        <option value="featured">
                            Featured
                        </option>

                        <option value="price-low">
                            Price: Low → High
                        </option>

                        <option value="price-high">
                            Price: High → Low
                        </option>

                        <option value="year">
                            Newest
                        </option>
                    </select>
                </div>

                {/* ================================================= */}
                {/* ================= CAR GRID ====================== */}
                {/* ================================================= */}

                <div className="grid">

                    {/* ================= SPONSORED AD ================= */}

                    <div
                        className="adCard"
                        data-reveal
                    >
                        <div className="adImage">

                            <img
                                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=85&w=1200&auto=format&fit=crop"
                                alt="BMW M4 Competition"
                            />

                            <div className="adOverlay" />

                            <span className="adBadge">
                                SPONSORED
                            </span>

                            <div className="adContent">

                                <small>
                                    BMW PERFORMANCE
                                </small>

                                <h3>
                                    Drive beyond
                                    <em> limits.</em>
                                </h3>

                                <p>
                                    BMW M4 Competition —
                                    engineered for pure
                                    performance and precision.
                                </p>

                                <div className="adBottom">

                                    <strong>
                                        $89,900
                                    </strong>

                                    <button
                                        className="goldBtn"
                                        onClick={() =>
                                            notify(
                                                "Opening BMW offer..."
                                            )
                                        }
                                    >
                                        Explore →
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ================= NORMAL CAR CARDS ================= */}

                    {filtered
                        .slice(0, visible)
                        .map((c, i) => (
                            <article
                                className="carCard"
                                data-reveal
                                style={{
                                    "--delay": `${i * 45}ms`,
                                }}
                                key={c.id}
                            >

                                {/* CAR IMAGE */}

                                <div className="carImage">

                                    <img
                                        src={c.image}
                                        alt={`${c.brand} ${c.model}`}
                                    />

                                    <span>
                                        {c.featured
                                            ? "FEATURED"
                                            : c.year}
                                    </span>

                                </div>

                                {/* CAR BODY */}

                                <div className="carBody">

                                    <div>
                                        <small>
                                            {c.brand} / {c.year}
                                        </small>

                                        <h3>
                                            {c.model}
                                        </h3>
                                    </div>

                                    <b>
                                        {money(c.price)}
                                    </b>

                                </div>

                                {/* SPECS */}

                                <div className="specs">

                                    <span>
                                        {Number(
                                            c.mileage
                                        ).toLocaleString()}{" "}
                                        km
                                    </span>

                                    <span>
                                        {c.transmission}
                                    </span>

                                    <span>
                                        {c.fuel}
                                    </span>

                                </div>

                                {/* ACTIONS */}

                                <div className="cardActions">

                                    <button
                                        onClick={() =>
                                            setModal(c)
                                        }
                                    >
                                        View
                                    </button>

                                    <a
                                        href={`/buy/${c.id}`}
                                    >
                                        Buy ↗
                                    </a>

                                    <button
                                        onClick={() => add(c)}
                                    >
                                        + Garage
                                    </button>

                                </div>

                            </article>
                        ))}

                </div>

                {/* ================= LOAD MORE ================= */}

                {visible < filtered.length && (
                    <button
                        className="moreBtn"
                        onClick={() =>
                            setVisible((v) =>
                                Math.min(
                                    v + 6,
                                    filtered.length
                                )
                            )
                        }
                    >
                        {text.more}
                        <span>↓</span>
                    </button>
                )}
            </section>

            {/* ================= MANIFESTO ================= */}

            <section
                id="about"
                className="manifesto section"
            >
                <div className="manifestoGlow" />

                <div data-reveal>

                    <p className="eyebrow">
                        THE L1 LZT STANDARD
                    </p>

                    <h2>
                        {text.about
                            .split(" ")
                            .slice(0, 3)
                            .join(" ")}
                        <br />

                        <em>
                            {text.about
                                .split(" ")
                                .slice(3)
                                .join(" ")}
                        </em>
                    </h2>

                    <p className="manifestoText">
                        We do not fill a showroom.
                        We curate a collection.
                        Every car has a character,
                        and every detail is part
                        of the experience.
                    </p>

                </div>

                <div
                    className="values"
                    data-reveal
                >
                    <div>
                        <b>01</b>
                        <span>
                            Curated
                            <br />
                            Selection
                        </span>
                    </div>

                    <div>
                        <b>02</b>
                        <span>
                            Verified
                            <br />
                            Condition
                        </span>
                    </div>

                    <div>
                        <b>03</b>
                        <span>
                            Premium
                            <br />
                            Service
                        </span>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}

            <footer>

                <div className="logo">
                    <span>L1</span>{" "}
                    LzT <b>Motors</b>
                </div>

                <a href="/contact">
                    Contact us ↗
                </a>

                <small>
                    © 2026 L1 LzT Motors
                </small>

            </footer>

            {/* ================================================= */}
            {/* ================= DETAIL MODAL ================== */}
            {/* ================================================= */}

            {modal &&
                modal !== "garage" &&
                modal !== "add" &&
                !modal.id && (
                    <div
                        className="overlay"
                        onClick={() => setModal(null)}
                    >
                        <div
                            className="detail"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                className="close"
                                onClick={() =>
                                    setModal(null)
                                }
                            >
                                ×
                            </button>

                            <img
                                src={modal.image}
                                alt={modal.model}
                            />

                            <div>

                                <p className="eyebrow">
                                    {modal.brand} /{" "}
                                    {modal.year}
                                </p>

                                <h2>
                                    {modal.model}
                                </h2>

                                <strong className="detailPrice">
                                    {money(modal.price)}
                                </strong>

                                <p className="detailSpecs">
                                    {Number(
                                        modal.mileage
                                    ).toLocaleString()}{" "}
                                    km · {modal.fuel} ·{" "}
                                    {modal.transmission}
                                    <br />
                                    {modal.color} ·{" "}
                                    {modal.location}
                                </p>

                                <div className="heroButtons">

                                    <a
                                        className="goldBtn"
                                        href={`/buy/${modal.id}`}
                                    >
                                        Buy this vehicle →
                                    </a>

                                    <button
                                        className="ghostBtn"
                                        onClick={() =>
                                            add(modal)
                                        }
                                    >
                                        Add to Garage
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                )}

            {/* ================= GARAGE ================= */}

            {modal === "garage" && (
                <div
                    className="overlay"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="panel"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close"
                            onClick={() =>
                                setModal(null)
                            }
                        >
                            ×
                        </button>

                        <p className="eyebrow">
                            YOUR GARAGE
                        </p>

                        <h2>
                            Saved vehicles
                        </h2>

                        {garage.length ? (
                            garage.map((c) => (
                                <div
                                    className="cartRow"
                                    key={c.id}
                                >

                                    <img
                                        src={c.image}
                                        alt={c.model}
                                    />

                                    <div>
                                        <b>
                                            {c.brand}{" "}
                                            {c.model}
                                        </b>

                                        <span>
                                            {money(c.price)}
                                        </span>
                                    </div>

                                    <a
                                        className="smallBtn"
                                        href={`/buy/${c.id}`}
                                    >
                                        Buy
                                    </a>

                                    <button
                                        onClick={() =>
                                            setGarage(
                                                garage.filter(
                                                    (x) =>
                                                        x.id !==
                                                        c.id
                                                )
                                            )
                                        }
                                    >
                                        ×
                                    </button>

                                </div>
                            ))
                        ) : (
                            <p className="muted">
                                Your garage is empty.
                            </p>
                        )}

                    </div>
                </div>
            )}

            {/* ================= ADMIN ================= */}

            {admin && (
                <Admin
                    cars={cars}
                    onAdd={() =>
                        setModal("add")
                    }
                    onEdit={(id) =>
                        setModal({ id })
                    }
                    onDelete={(id) => {
                        setCars(
                            cars.filter(
                                (c) => c.id !== id
                            )
                        );

                        notify("Vehicle deleted");
                    }}
                    onClose={() =>
                        setAdmin(false)
                    }
                />
            )}

            {/* ================= CAR FORM ================= */}

            {(modal === "add" ||
                modal?.id) && (
                <CarForm
                    initial={
                        modal === "add"
                            ? null
                            : cars.find(
                                  (c) =>
                                      c.id ===
                                      modal.id
                              )
                    }
                    onSave={save}
                    onClose={() =>
                        setModal(null)
                    }
                />
            )}

            {/* ================= TOAST ================= */}

            {toast && (
                <div className="toast">
                    {toast}
                </div>
            )}

        </main>
    );
}


/* ========================================================= */
/* ======================= ADMIN =========================== */
/* ========================================================= */

function Admin({
    cars,
    onAdd,
    onEdit,
    onDelete,
    onClose,
}) {
    const [tab, setTab] = useState("overview");
    const [q, setQ] = useState("");

    const list = cars.filter((c) =>
        `${c.brand} ${c.model}`
            .toLowerCase()
            .includes(q.toLowerCase())
    );

    const value = cars.reduce(
        (s, c) => s + Number(c.price),
        0
    );

    return (
        <div className="admin">

            <div className="adminTop">

                <div>

                    <p className="eyebrow">
                        SECURE CONTROL / CTRL + ALT + B
                    </p>

                    <h2>
                        Admin <em>Command</em>
                    </h2>

                </div>

                <button
                    className="ghostBtn"
                    onClick={onClose}
                >
                    Exit
                </button>

            </div>

            <div className="adminNav">

                {[
                    "overview",
                    "inventory",
                    "analytics",
                ].map((t) => (
                    <button
                        className={
                            tab === t
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setTab(t)
                        }
                        key={t}
                    >
                        {t}
                    </button>
                ))}

            </div>

            {/* ================= OVERVIEW ================= */}

            {tab === "overview" && (
                <>
                    <div className="adminStats">

                        <div>
                            <b>
                                {cars.length}
                            </b>
                            <span>
                                Vehicles
                            </span>
                            <small>
                                Live catalog
                            </small>
                        </div>

                        <div>
                            <b>
                                {
                                    cars.filter(
                                        (c) =>
                                            c.featured
                                    ).length
                                }
                            </b>

                            <span>
                                Featured
                            </span>

                            <small>
                                Homepage picks
                            </small>
                        </div>

                        <div>
                            <b>
                                {money(value)}
                            </b>

                            <span>
                                Inventory value
                            </span>

                            <small>
                                Total asking price
                            </small>
                        </div>

                        <div>
                            <b>
                                {
                                    new Set(
                                        cars.map(
                                            (c) =>
                                                c.brand
                                        )
                                    ).size
                                }
                            </b>

                            <span>
                                Brands
                            </span>

                            <small>
                                Global selection
                            </small>
                        </div>

                    </div>

                    <div className="adminQuick">

                        <p className="eyebrow">
                            QUICK ACTIONS
                        </p>

                        <button
                            className="goldBtn"
                            onClick={onAdd}
                        >
                            + Add vehicle
                        </button>

                        <button
                            className="ghostBtn"
                            onClick={() =>
                                setTab(
                                    "inventory"
                                )
                            }
                        >
                            Manage inventory
                        </button>

                        <div className="shortcut">
                            Ctrl + Alt + B
                            <br />
                            <span>
                                Admin shortcut
                            </span>
                        </div>

                    </div>
                </>
            )}

            {/* ================= INVENTORY ================= */}

            {tab === "inventory" && (
                <div className="inventoryAdmin">

                    <div className="adminTools">

                        <input
                            value={q}
                            onChange={(e) =>
                                setQ(
                                    e.target.value
                                )
                            }
                            placeholder="Search inventory..."
                        />

                        <button
                            className="goldBtn"
                            onClick={onAdd}
                        >
                            + Add
                        </button>

                    </div>

                    {list.map((c) => (
                        <div
                            className="adminRow"
                            key={c.id}
                        >

                            <img
                                src={c.image}
                                alt={c.model}
                            />

                            <div>

                                <b>
                                    {c.brand}{" "}
                                    {c.model}
                                </b>

                                <span>
                                    {c.year} ·{" "}
                                    {money(
                                        c.price
                                    )}{" "}
                                    · {c.fuel}
                                </span>

                            </div>

                            {c.featured && (
                                <i className="stockPill">
                                    FEATURED
                                </i>
                            )}

                            <button
                                onClick={() =>
                                    onEdit(c.id)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger"
                                onClick={() =>
                                    onDelete(c.id)
                                }
                            >
                                Delete
                            </button>

                        </div>
                    ))}

                </div>
            )}

            {/* ================= ANALYTICS ================= */}

            {tab === "analytics" && (
                <div className="analytics">

                    <div className="analyticsCard">

                        <p className="eyebrow">
                            BRAND MIX
                        </p>

                        <h3>
                            Collection
                            distribution
                        </h3>

                        {Object.entries(
                            cars.reduce(
                                (a, c) => {
                                    a[c.brand] =
                                        (a[c.brand] ||
                                            0) + 1;

                                    return a;
                                },
                                {}
                            )
                        )
                            .slice(0, 8)
                            .map(([b, n]) => (
                                <div
                                    className="bar"
                                    key={b}
                                >

                                    <span>
                                        {b}
                                    </span>

                                    <i
                                        style={{
                                            "--w": `${
                                                (n /
                                                    cars.length) *
                                                100
                                            }%`,
                                        }}
                                    />

                                    <b>
                                        {n}
                                    </b>

                                </div>
                            ))}

                    </div>

                    <div className="analyticsCard">

                        <p className="eyebrow">
                            AVERAGE
                        </p>

                        <h3>
                            {money(
                                value /
                                    cars.length
                            )}
                        </h3>

                        <p className="muted">
                            Average asking price
                            across the current
                            catalog.
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
}


/* ========================================================= */
/* ===================== CAR FORM ========================== */
/* ========================================================= */

function CarForm({
    initial,
    onSave,
    onClose,
}) {
    const [f, setF] = useState(
        initial || {
            brand: "BMW",
            model: "",
            year: 2026,
            price: 0,
            mileage: 0,
            fuel: "Petrol",
            transmission: "Automatic",
            color: "Black",
            location: "Tashkent",
            featured: false,
            image:
                "https://images.unsplash.com/photo-1492144534655-ae79c964c9d9?q=85&w=1600&auto=format&fit=crop",
        }
    );

    const set = (k, v) =>
        setF({
            ...f,
            [k]: v,
        });

    return (
        <div className="overlay">

            <div className="form">

                <button
                    className="close"
                    onClick={onClose}
                >
                    ×
                </button>

                <p className="eyebrow">
                    VEHICLE EDITOR
                </p>

                <h2>
                    {initial
                        ? "Edit"
                        : "Add"}{" "}
                    <em>Vehicle</em>
                </h2>

                <div className="formGrid">

                    {[
                        "brand",
                        "model",
                        "year",
                        "price",
                        "mileage",
                        "fuel",
                        "transmission",
                        "color",
                        "location",
                        "image",
                    ].map((k) => (
                        <label key={k}>

                            {k}

                            <input
                                value={
                                    f[k]
                                }
                                onChange={(e) =>
                                    set(
                                        k,
                                        [
                                            "year",
                                            "price",
                                            "mileage",
                                        ].includes(
                                            k
                                        )
                                            ? Number(
                                                  e
                                                      .target
                                                      .value
                                              )
                                            : e
                                                  .target
                                                  .value
                                    )
                                }
                            />

                        </label>
                    ))}

                    <label className="check">

                        <input
                            type="checkbox"
                            checked={
                                f.featured
                            }
                            onChange={(e) =>
                                set(
                                    "featured",
                                    e.target
                                        .checked
                                )
                            }
                        />

                        Featured

                    </label>

                </div>

                <button
                    className="goldBtn"
                    onClick={() =>
                        onSave(f)
                    }
                >
                    Save vehicle ✓
                </button>

            </div>

        </div>
    );
}
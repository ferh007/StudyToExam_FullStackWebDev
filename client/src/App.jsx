import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";

import NavBar from "./components/navBar.jsx";
import SearchBar from "./components/searchBar.jsx";
import UpdateEvent from "./components/updateEvent.jsx";

// === Base URL for raw axios (dev vs prod) ===
const API_BASE =("https://studytoexam-fullstackwebdev.onrender.com");

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/events`);
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container p-4">
      <h1>Top Events</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {events.map((e) => (
            <div key={e._id} className="card">
              <img src={`/images/${e.img}`} alt={e.title} />
              <h3>{e.title}</h3>
              <p>{e.location}</p>
              <p>${e.price?.toFixed(2)} • ⭐{e.rating}</p>
              <Link to={`/update/${e._id}`}>Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchPage = () => {
  const query = useQuery();
  const keyword = query.get("keyword") || "";
  const [events, setEvents] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!keyword.trim()) {
        setEvents([]);
        setSearched(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_BASE}/events`, {
          params: { keyword },
        });
        setEvents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setSearched(true);
      }
    };
    run();
  }, [keyword]);

  return (
    <div className="container p-4">
      <h1>Search Events</h1>
      <SearchBar />
      {searched && (
        <>
          <h3 className="mt-4">
            Results for: <em>{keyword}</em>
          </h3>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="grid">
              {events.map((e) => (
                <div key={e._id} className="card">
                  <img src={`/images/${e.img}`} alt={e.title} />
                  <h3>{e.title}</h3>
                  <p>{e.location}</p>
                  <p>${e.price?.toFixed(2)} • ⭐{e.rating}</p>
                  <Link to={`/update/${e._id}`}>Edit</Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/update/:id" element={<UpdateEvent onUpdate={() => {}} />} />
      </Routes>
    </>
  );
}

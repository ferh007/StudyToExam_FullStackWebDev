import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// === Base URL for raw axios (dev vs prod) ===
const API_BASE = import.meta.env.PROD
  ? "https://studytoexam-fullstackwebdev.onrender.com/api" // prod (Render)
  : "http://localhost:3000/api";                            // dev (local Express)

const UpdateEvent = ({ onUpdate = (f) => f }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/events/${id}`);
        setPrice(res.data.price);
        setRating(res.data.rating);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/events/${id}`, { price, rating });
      onUpdate();
      navigate("/");
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <div>
      <h2>Update Event</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>

        <button type="submit" className="m-5 p-3 w-25">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;

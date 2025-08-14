import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateEvent = ({ onUpdate = (f) => f }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/events/${id}`);
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
      await axios.put(`http://localhost:3000/api/events/${id}`, {
        price,
        rating,
      });
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

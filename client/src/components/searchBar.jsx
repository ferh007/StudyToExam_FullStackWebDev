import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <form className="form" onSubmit={submitForm}>
      <label htmlFor="keyword">
        Search for an event by location or by rating
      </label>
      <input
        type="text"
        name="keyword"
        id="keyword"
        className="m-5"
        placeholder="Enter location or rating..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;

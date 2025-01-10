import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
import "./index.css";
import App from "./App";
function Stest() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color="blue" MaxRatin={10} onMovieRating={setMovieRating} />
      <p>the rating for this film is {movieRating}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    {/* <StarRating
      MaxRatin={5}
      messages={["terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating size={24} color="green" className="test" defultRating={2} />
    
    <Stest />
    */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

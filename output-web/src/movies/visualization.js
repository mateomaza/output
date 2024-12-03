import React from "react";
import { Link } from "react-router-dom";

function VisualizationPage() {
    return (
      <div>
        <Link to="/movies">Go back to ranking</Link>
        <h1 className="mt-5">Visualization</h1>
        <img
          src="http://127.0.0.1:8000/api/movies/high-rated-movies/"
          alt="High Rated Movies by Year"
          style={{ width: "100%", maxWidth: "800px" }}
        />
      </div>
    );
  }
  
  export default VisualizationPage;
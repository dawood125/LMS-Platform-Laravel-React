import React from "react";

const NotFound = ({ text }) => {
  return (
    <div className="col-md-12">
      <div className="card shadow border-0 py-5 text-center">
        <h4 className="lead">{text || "Records Not Found"}</h4>
        <p>
          We could not find any matching records. Please try a different search
          or filter.
        </p>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";

const Spinner = () => {
  return (
    <div className="spinner-border text-primary mt-5 spinner" role="status">
      <span className="visually-hidden">Chargement...</span>
    </div>
  );
};

export default Spinner;
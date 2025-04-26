import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

const Users = () => {
  return (
    <React.Fragment>
      <h1>Test</h1>

      <div>
        <h1>Welcome to Dental Clinic</h1>
        <p>We provide quality dental care with a personal touch.</p>
        <ul>
          <li>✔ Teeth Cleaning</li>
          <li>✔ Root Canals</li>
          <li>✔ Braces & Invisalign</li>
          <li>✔ Cosmetic Dentistry</li>
        </ul>
        <Link
          to="/book"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Schedule an Appointment
        </Link>
      </div>
    </React.Fragment>
  );
};

export default Users;

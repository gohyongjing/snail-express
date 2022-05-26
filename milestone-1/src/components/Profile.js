import React from "react";
import { Card, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../images/profile.jpg";

export default function Profile() {
  const { currentUser } = useAuth();
  return (
    <>
      <Card>
        <Card.Body>
          {/* <img src={logo} className="img-responsive" alt="Website logo" height="150px" /> */}
          <h2 className="text-center mb-4">Profile</h2>
          <div>
            <strong>Name:</strong> Snail Ting
          </div>
          <div>
            <strong>Email:</strong> {currentUser.email}
          </div>
          <div>
            <strong>Enrolled course:</strong> CS2030Snail
          </div>
          <div>
            <strong>Role:</strong> Snail
          </div>
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update profile
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}

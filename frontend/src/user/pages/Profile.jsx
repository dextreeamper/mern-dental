import React, { useState, useEffect, useContext, useCallback } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Profile = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [userProfile, setUserProfile] = useState(null);
  const auth = useContext(AuthContext);

  const fetchUserProfile = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:9000/api/users/profile/${auth.userId}`
      );
      setUserProfile(responseData.user);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }, [sendRequest, auth.userId, auth.token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userProfile && (
        <Card
          className="card-item__content"
          style={{ padding: "1rem", width: "550px", margin: "0 auto" }}
        >
          <div className="card-item__info">
            <h1>Patient Details</h1>
            <h2>{userProfile.name}</h2>
            <h3>{userProfile.email}</h3>
          </div>
          <Button className="center" to={`/user/profile/edit`}>
            EDIT
          </Button>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Profile;

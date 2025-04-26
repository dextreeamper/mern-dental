import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UpdateProfile = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:9000/api/users/profile/${auth.userId}`
        );
        setLoadedUser(responseData.user);
        setFormData(
          {
            name: {
              value: responseData.user.name,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth.userId, setFormData]);

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // const formData = new FormData();
      // formData.append("name", formState.inputs.name.value);
      await sendRequest(
        `http://localhost:9000/api/users/profile/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          name: formState.inputs.name.value,
        }),
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/user/profile");
    } catch (err) {
      console.log("Err in UpdateProfile:", err);
    }
  };

  console.log(auth);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUser && (
        <form className="place-form" onSubmit={userUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedUser.name}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE USER
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateProfile;

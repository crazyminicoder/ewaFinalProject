import React, { useState } from "react";
import { Modal, Input, Spacer, Button, Text } from "@nextui-org/react";
import { connect } from "react-redux";
import { ACTIONS } from "../action";

const SignUp = ({ visible, closeHandler, signup, state }) => {
  const [errormsg, setErrormsg] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
     e.preventDefault();
      signup(formData);
      closeHandler();
  };

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Please Signin To Continue
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="User Name"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
            <Spacer />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Spacer />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Spacer />
            <Button type="submit" size="lg" style={{margin: "auto", width: "100%"}}>
              Submit{" "}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (payload) => {
      dispatch({
        type: ACTIONS.SIGNUP,
        payload: payload
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

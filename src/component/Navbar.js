import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spacer, Text, Row } from "@nextui-org/react";
import { connect } from "react-redux";
import {FaShoppingCart} from "react-icons/fa"
import SignUp from "./SignUp";
import { ACTIONS } from "../action";

const Navbar = ({ isLogin, name , cartItems ,logout }) => {

  const cartItemsLength = cartItems.length > 0 ? cartItems.length: ""

  const [visible, setVisible] = useState(false);
  const handler = () => {
    setVisible(true);
  };

  const closeHandler = () => {
    setVisible(false);
  };

 
  const handleLogout = () => {
    logout();
 };

  const subContent = !isLogin ? (
    <ul>
      <li>
        <Button onClick={handler}  style={{marginTop: "-5px"}}>Signup/Login</Button>
      </li>
    </ul>
  ) : (
    <ul className="subcontent" style={{marginTop: "-12px"}}>
      <li>
        <Row>
        <Link to="/cart" className="cart"><FaShoppingCart className="cart_icon"/>
         {cartItemsLength && <Text className="cart_count">
           {cartItemsLength}
           </Text>}
        </Link>
        <Spacer x={2}/>
        <Button auto onClick={handleLogout} style={{marginTop: "-5px"}}>
          <Link to="/" style={{color: "white"}}>Logout</Link>
        </Button>
       </Row>
      </li>
    </ul>
  );

  return (
    <nav className="nav_links_container">
      <div  className="nav_links">
      <h3 className="logo">
        <Link to="/" className="logo"><img src="/alacart.jpg"/></Link>
      </h3>
      <div style={{display: "flex", marginTop: "-15px"}}>
      {isLogin &&  <Text color="primary" size="2rem" style={{marginRight: "20px", marginTop: "-25px"}}>
        Welcome {name}
      </Text>
      }
       {subContent}
       </div>
       </div>
      {!!visible && <SignUp visible={visible} closeHandler={closeHandler} />}
    </nav>
  );
};

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLoggedIn,
    name: state.user.userName,
    cartItems: state.cartItems
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);


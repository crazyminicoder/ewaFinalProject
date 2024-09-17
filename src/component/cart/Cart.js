import React, { useState } from "react";
import { connect } from "react-redux";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Card, Grid, Row, Text, Input, Button} from "@nextui-org/react";
import { ACTIONS } from "../../action";
import "./cart.css"
import {CartTotal} from "../CartTotal"


const Cart = ({ cartItems, increase_item_count, decrease_item_count }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + parseInt(item.price) * +item.item_count, 0)
 

  const [discountCode, setDiscountCode] = useState("")
  const [discountMoney, setDiscountMoney] = useState(0)

  const applyDiscount = () => {
    const discount = subtotal * 30 / 100
   setDiscountMoney(discount)
  }

  return (
    <div className="cart_container">
      <div className="cart_subcontainer">
      {cartItems.map((item) => {
        const totalPrice = parseInt(item.price) * parseInt(item.item_count)
        return (
          <div className="cart_item">
            <img src={item.imgurl} className="cart_img"/>
                  <h4 style={{marginTop: "5px"}}>{item.name}</h4>
                  <p>
                  {item.price} X {item.item_count} = {totalPrice} Rs
                  </p>
                  <div className="btns_div">
                  <button
                    className="cart_count_btn"
                    onClick={() => increase_item_count({ id: item.id })}
                  >
                   <FaPlus /> 
                  </button>
                  <p>{item.item_count}</p>
                  <button
                    className="cart_count_btn"
                    onClick={() => decrease_item_count({ id: item.id })}
                  >
                    <FaMinus />
                  </button>
                  </div>
                </div>
          );
      })}
      <div className="discount_sec">
        <Text size={20}>Apply Discount Code</Text>
        <input type="text" placeholder="E.g. SUMMER30X"  className="discount_input"   onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}></input>
        <button className="discount_btn" onClick={applyDiscount}>Apply</button>
      </div>
      </div>
      <CartTotal subtotal={subtotal} discountMoney={discountMoney}/>
      </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    increase_item_count: (payload) =>
      dispatch({
        type: ACTIONS.INCREASE_ITEM_COUNT,
        payload: payload
      }),
    decrease_item_count: (payload) =>
      dispatch({
        type: ACTIONS.DECREASE_ITEM_COUNT,
        payload: payload
      })
  };
};
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Cart);

import React, { useState } from "react";
import { Card, Grid, Row, Text, Button, Modal } from "@nextui-org/react";
import { connect } from "react-redux";
import { ACTIONS } from "../action";
import Signup from "./SignUp";

function CardItem({ name, price, imgurl, addToCart, id, state }) {
  const [isvisible, setIsVisible] = useState(false);

  const closeHandler = () => {
    setIsVisible(false);
  };

  const handleAddToCart = () => {
    if (state.isLoggedIn) {
      addToCart({
        id,
        name,
        price,
        imgurl,
        item_count: 1
      });
    } else {
      setIsVisible(true);
    }
  };
  return (
    <Grid xs={6} sm={3}>
      <Card hoverable clickable>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            objectFit="cover"
            src={imgurl}
            width="100%"
            height={140}
            alt={name}
          />
        </Card.Body>
        <Card.Footer justify="flex-start">
          <Row wrap="wrap" justify="space-between">
            <Text b style={{fontSize: "18px"}}>{name}</Text>
            <Text css={{ color: "$accents4", fontWeight: "$semibold" }}>
              {price} Rs/Piece
            </Text>
            <Button size="lg" onClick={handleAddToCart} className="add_to_cart_btn">
              Add to cart
            </Button>
          </Row>
        </Card.Footer>
      </Card>
      {isvisible && <Signup visible={isvisible} closeHandler={closeHandler} />}
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    state
  };
};

const mapDisptachToProps = (dispatch) => {
  return {
    addToCart: (payload) => {
      dispatch({
        type: ACTIONS.ADD_TO_CART,
        payload: payload
      });
    }
  };
};

export default connect(mapStateToProps, mapDisptachToProps)(CardItem);

import React , {useState}from "react"
import { Button, Text, Spacer } from "@nextui-org/react"
import {FaMinus} from "react-icons/fa"
import AddressForm from "./AddressForm"

export const CartTotal = ({subtotal, discountMoney}) => {
  let shipping = 20;
  const totalMoney = subtotal - discountMoney;

  const [visible, setVisible] = useState(false);
  const handler = () => {
    setVisible(true);
  };

  const closeHandler = () => {
    setVisible(false);
  };

 
    return(
        <div className="cart_total">
            <div>
        <Text  size={35}
        css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
        }}
        weight="bold"
        >Cart Totals</Text>
        <div className="totalcart_text">
            <p>Subtotal</p>
            <p>{subtotal} Rs</p>
        </div>
        <div  className="totalcart_text">
            <p>Total Discount</p>
            <FaMinus className="text-white" />
            <p>{discountMoney}</p>
        </div>
        <div  className="total_orderprice_sec totalcart_text">
            <p>Total Order Price</p>
            <p>{totalMoney}</p>
        </div>
        </div>
        <div>
            <Spacer y={2}></Spacer>
        <Text  size={20}
        css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}
          weight="bold"
          >Shipping</Text>
        <div  className="totalcart_text">
            <p>Next Day</p>
            <p>{shipping}</p>
        </div>
        <div  className="totalcart_text">
            <p>Shipping To India</p>
            <FaMinus className="text-white" />
        </div>
        <div  className="totalcart_text">
            <Text  size={20}
        css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
        }}
        weight="bold"
        >Order Total</Text>
            <p>{totalMoney + shipping}</p>
        </div>
        </div>
        <Spacer y={1}></Spacer>
        <Button size="lg" className="checkout_btn" onClick={handler}>GO TO CHECKOUT </Button>
        {visible && <AddressForm closeHandler={closeHandler} visible={visible}/>}
        </div>
    )
}
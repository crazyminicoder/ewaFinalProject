import React, { useState } from "react"
import {Modal, Input, Button, Text, Spacer } from "@nextui-org/react"
import { connect } from "react-redux"
import { ACTIONS } from "../action"

const AddressForm = ({add_address, visible, closeHandler}) => {
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        pincode: "",
        mobileNo: "",
    })
 
   const handleSubmit = (e) => {
       e.preventDefault()
       add_address(formData)
       closeHandler();
   } 
    return (
        <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={28}>
            Add Address
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
              placeholder="Enter Your Address" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            
            />
            <Spacer />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              type="text"
              placeholder="Enter Your City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
             
            />
            <Spacer />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              type="number"
              placeholder="Enter Your Pin code"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
             
            />
            <Spacer />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              type="number"
              placeholder="Enter Your Mobile number"
              value={formData.mobileNo}
              onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
              
            />
            <Spacer/>
            <Button type="submit" size="lg" style={{margin: "auto", width: "100%"}}>
              Deliever here{" "}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
   )
}

const mapDispatchToProps = (dispatch) => {
 return {
     add_address: (payload) => {
         dispatch({
            type: ACTIONS.ADD_ADDRESS,
            payload: payload
            })
     }
 }
}

export default connect(null, mapDispatchToProps)(AddressForm)


const db = require('../models'); // Ensure this line is present at the top

exports.placeOrder = async (req, res) => {
    const { items, totalPrice, customerDetails, paymentDetails, userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'Login to proceed!' });
    }
  
    try {
      const order = await db.Order.create({
        userId,
        items: JSON.stringify(items),
        status: 'pending',
        totalPrice,
        customerDetails: JSON.stringify(customerDetails),
        paymentDetails: JSON.stringify(paymentDetails),
      });
  
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Failed to place order' });
    }
  };
  

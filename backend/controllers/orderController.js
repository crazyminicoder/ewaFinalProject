const db = require('../models');
exports.placeOrder = async (req, res) => {
    const { items, totalPrice } = req.body;

    try {
        const order = await db.Order.create({
            items: JSON.stringify(items),
            totalPrice,
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
};

import { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

type Car = {
    title: string;
    img: string;
    price: string;
    description: string;
    trim: string;
};

export default function CartPage(): JSX.Element {
    const [cartItems, setCartItems] = useState<Car[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(storedCart);
    }, []);

    const handleRemoveFromCart = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleClearCart = () => {
        localStorage.removeItem("cart");
        setCartItems([]);
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const userId = localStorage.getItem('userId');

        const orderDetails = cartItems.map(item => ({
            userId,
            carId: item.title, // Use car ID to link to the backend model
            totalPrice: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
            status: "pending", // Default order status
        }));

        console.log("order details = ",orderDetails)

        try {
            const response = await fetch('http://localhost:3000/api/orders', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully!'); // Notify the user
                localStorage.removeItem("cart"); // Clear the cart
                setCartItems([]); // Clear the local state
                navigate('/'); // Redirect to home or another page
            } else {
                alert(data.message || 'Failed to place the order.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred while placing the order.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-8">
                Your cart is empty.
                <Button onClick={handleGoBack} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-8 py-8">
            <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cartItems.map((item, index) => (
                    <Card key={index} shadow="sm">
                        <CardBody className="p-0">
                            <img
                                src={item.img}
                                alt={item.title}
                                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            <h3 className="p-2 text-lg font-semibold">{item.title}</h3>
                            <p className="p-2 text-small text-default-500">
                                {item.trim || "No trim available"}
                            </p>
                            <p className="p-2 text-small">{item.description}</p>
                        </CardBody>
                        <CardFooter className="flex justify-between items-center">
                            <p style={{ color: "#E42638", fontSize: "1rem" }}>{item.price}</p>
                            <Button size="sm" color="danger" onClick={() => handleRemoveFromCart(index)}>
                                Remove
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end mt-6">
                <Button color="warning" onClick={handleClearCart}>
                    Clear Cart
                </Button>
            </div>

            <div className="flex justify-between mt-6">
                <Button onClick={handleGoBack}>
                    Go Back
                </Button>
                <Button color="success" onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
}

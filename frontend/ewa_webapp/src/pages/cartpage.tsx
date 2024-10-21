import { useState, useEffect } from "react";
import { 
    Card, 
    CardBody, 
    CardFooter, 
    Button, 
    Divider,
    Input,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    Textarea
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

type Car = {
    title: string;
    img: string;
    price: string;
    description: string;
    trim: string;
};

type PaymentMode = "full" | "reservation";
type PaymentMethod = "credit" | "debit" | "bank";

export default function CartPage(): JSX.Element {
    const [cartItems, setCartItems] = useState<Car[]>([]);
    const [paymentMode, setPaymentMode] = useState<PaymentMode>("full");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
    const [reservationAmount, setReservationAmount] = useState<string>("1000");
    const navigate = useNavigate();

    // Customer Details
    const [customerDetails, setCustomerDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const handlePaymentModeChange = (value: string) => {
        setPaymentMode(value as PaymentMode);
    };
    
    // Payment Details
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(storedCart);
    }, []);

    const handleRemoveFromCart = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
            return total + price;
        }, 0);
    };

    const handleInputChange = (field: string, value: string, section: 'customer' | 'payment') => {
        if (section === 'customer') {
            setCustomerDetails(prev => ({ ...prev, [field]: value }));
        } else {
            setPaymentDetails(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Validate customer details
        for (const [key, value] of Object.entries(customerDetails)) {
            if (!value) {
                alert(`Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        // Validate payment details
        for (const [key, value] of Object.entries(paymentDetails)) {
            if (!value) {
                alert(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        const userId = localStorage.getItem('userId');
        const orderDetails = {
            items: cartItems.map(item => ({
                carId: item.title,
                totalPrice: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
            })),
            customerDetails,
            paymentDetails: {
                method: paymentMethod,
                mode: paymentMode,
                reservationAmount: paymentMode === "reservation" ? parseFloat(reservationAmount) : null
            },
            status: "pending",
            userId
        };

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully!');
                localStorage.removeItem("cart");
                setCartItems([]);
                navigate('/');
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

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.08;
    const total = paymentMode === "reservation" ? parseFloat(reservationAmount) : (subtotal + tax);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <Button variant="bordered" onClick={handleGoBack} className="ml-4">
            Continue Shopping
        </Button>
    </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Cart Items */}
                <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {cartItems.map((item, index) => (
                            <Card key={index} shadow="sm">
                                <CardBody className="p-0">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">{item.title}</h3>
                                        <p className="text-small text-default-500">
                                            {item.trim || "No trim available"}
                                        </p>
                                        <p className="text-small mt-2">{item.description}</p>
                                    </div>
                                </CardBody>
                                <CardFooter className="flex justify-between items-center">
                                    <p className="text-danger text-lg">{item.price}</p>
                                    <Button 
                                        color="danger" 
                                        size="sm" 
                                        onClick={() => handleRemoveFromCart(index)}
                                    >
                                        Remove
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Column - Checkout Forms */}
                <div className="lg:w-1/2 space-y-6">
                    {/* Customer Details Card */}
                    <Card shadow="sm">
                        <CardBody className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Customer Details</h2>
                            <Input
                                label="Name"
                                placeholder="Enter your name"
                                value={customerDetails.firstName}
                                onChange={(e) => handleInputChange('Name', e.target.value, 'customer')}
                            />
                            <Input
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={customerDetails.email}
                                onChange={(e) => handleInputChange('email', e.target.value, 'customer')}
                            />
                            <Input
                                type="tel"
                                label="Phone"
                                placeholder="Enter your phone number"
                                value={customerDetails.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value, 'customer')}
                            />
                            <Textarea
                                label="Address"
                                placeholder="Enter your address"
                                value={customerDetails.address}
                                onChange={(e) => handleInputChange('address', e.target.value, 'customer')}
                            />
                        </CardBody>
                    </Card>

                    {/* Payment Details Card */}
                    <Card shadow="sm">
                        <CardBody className="p-6 space-y-4">
                            <h2 className="text-xl font-semibold">Payment Details</h2>
                            
                            <RadioGroup 
                                label="Payment Mode"
                                value={paymentMode}
                                onValueChange={handlePaymentModeChange}
                            >
                                <Radio value="full">Full Payment</Radio>
                                <Radio value="reservation">Reservation</Radio>
                            </RadioGroup>

                            {paymentMode === "reservation" && (
                                <Input
                                    type="number"
                                    label="Reservation Amount"
                                    placeholder="Enter reservation amount"
                                    value={reservationAmount}
                                    onChange={(e) => setReservationAmount(e.target.value)}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$</span>
                                        </div>
                                    }
                                />
                            )}

                            <Select 
                                label="Payment Method"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            >
                                <SelectItem key="credit" value="credit">Credit Card</SelectItem>
                                <SelectItem key="debit" value="debit">Debit Card</SelectItem>
                                <SelectItem key="bank" value="bank">Bank Transfer</SelectItem>
                            </Select>

                            <Input
                                label="Card Number"
                                placeholder="Enter card number"
                                value={paymentDetails.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value, 'payment')}
                            />
                            <div className="flex gap-4">
                                <Input
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    value={paymentDetails.expiryDate}
                                    onChange={(e) => handleInputChange('expiryDate', e.target.value, 'payment')}
                                />
                                <Input
                                    label="CVV"
                                    placeholder="CVV"
                                    type="password"
                                    maxLength={3}
                                    value={paymentDetails.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value, 'payment')}
                                />
                            </div>
                            <Input
                                label="Name on Card"
                                placeholder="Enter name on card"
                                value={paymentDetails.nameOnCard}
                                onChange={(e) => handleInputChange('nameOnCard', e.target.value, 'payment')}
                            />
                        </CardBody>
                    </Card>

                    {/* Order Summary Card */}
                    <Card shadow="sm">
                        <CardBody className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-default-500">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {paymentMode === "full" && (
                                    <div className="flex justify-between">
                                        <span className="text-default-500">Tax (8%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-default-500">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <Divider />
                                <div className="flex justify-between font-semibold">
                                    <span>{paymentMode === "reservation" ? "Reservation Amount" : "Total"}</span>
                                    <span className="text-xl">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button 
                                color="success"
                                className="w-full mt-6"
                                onClick={handleCheckout}
                            >
                                {paymentMode === "reservation" ? "Pay Reservation" : "Complete Purchase"}
                            </Button>
                            <Button 
                                variant="bordered"
                                className="w-full mt-4"
                                onClick={handleGoBack}
                            >
                                Check Other Cars
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
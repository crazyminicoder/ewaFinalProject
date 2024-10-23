import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardBody, 
  CardFooter, 
  Button, 
  Divider
} from "@nextui-org/react";

// Define the types for Car and Order
type Car = {
  id: number;
  title: string;
  img: string;
  price: number;
  description: string;
  trim: string;
  year: number;
  engineType: string;
  horsepower: string;
  transmission: string;
  fuelEfficiency: string;
  seatingCapacity: number;
};

type Order = {
  orderId: number;
  status: string;
  totalPrice: number;
  car: Car | null;
};

const OrdersPage = (): JSX.Element => {
  const { userId } = useParams(); // Get userId from route parameter
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation

  // Fetch orders on component mount or when userId changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch orders.");
        
        const data: Order[] = await response.json();
        setOrders(data);
        console.log("Fetched orders:", data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleGoBack = () => navigate("/"); // Navigate back to home

  if (loading) return <p className="text-center mt-8">Loading orders...</p>;

  if (!orders.length) {
    return (
      <div className="text-center mt-8">
        <p>No orders found.</p>
        <Button className="mt-4" onClick={handleGoBack}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Orders</h1>
        <Button variant="bordered" onClick={handleGoBack}>
          Back to Home
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <Card key={order.orderId} shadow="sm">
            <CardBody className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order #{order.orderId}</h2>
              <p>Status: <span className="text-primary">{order.status}</span></p>
              <p>Total Price: <span className="text-success">${order.totalPrice.toFixed(2)}</span></p>

              {order.car ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Car Details</h3>
                  <p>{order.car.title} ({order.car.year})</p>
                  <img
                    src={order.car.img}
                    alt={order.car.title}
                    className="w-full h-48 object-cover"
                  />
                  <Divider />
                  <p>Price: ${order.car.price.toFixed(2)}</p>
                  <p>Trim: {order.car.trim}</p>
                  <p>Engine Type: {order.car.engineType}</p>
                  <p>Horsepower: {order.car.horsepower}</p>
                  <p>Transmission: {order.car.transmission}</p>
                  <p>Fuel Efficiency: {order.car.fuelEfficiency}</p>
                  <p>Seating Capacity: {order.car.seatingCapacity}</p>
                </div>
              ) : (
                <p>No car details available.</p>
              )}
            </CardBody>

            <CardFooter className="flex justify-end">
              <Button variant="bordered" onClick={() => alert("Reorder feature coming soon!")}>
                Reorder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
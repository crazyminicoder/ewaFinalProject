import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Accordion,
  AccordionItem,
  Chip,
  Divider,
  Button,
  Spinner
} from "@nextui-org/react";
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

// Interface definitions
interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface PaymentDetails {
  method: string;
  mode: string;
  reservationAmount?: number;
}

interface OrderItem {
  carId: number;
  totalPrice: number;
  carDetails?: {
    title: string;
    img: string;
    description: string;
    trim: string;
  };
}

interface Order {
  id: number;
  userId: number;
  carId: number;
  items: string;
  status: string;
  totalPrice: number;
  customerDetails: string;
  paymentDetails: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/orders/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        
        // Fetch car details for each order
        const ordersWithCarDetails = await Promise.all(
          data.map(async (order: Order) => {
            const items = JSON.parse(order.items);
            const itemsWithDetails = await Promise.all(
              items.map(async (item: OrderItem) => {
                try {
                  const carResponse = await fetch(`http://localhost:3000/api/cars/${item.carId}`);
                  if (carResponse.ok) {
                    const carDetails = await carResponse.json();
                    return { ...item, carDetails };
                  }
                  return item;
                } catch (error) {
                  console.error(`Failed to fetch car details for ID ${item.carId}:`, error);
                  return item;
                }
              })
            );
            return { ...order, items: JSON.stringify(itemsWithDetails) };
          })
        );
        
        setOrders(ordersWithCarDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, "warning" | "success" | "danger" | "primary" | "default"> = {
      pending: "warning",
      completed: "success",
      cancelled: "danger",
      processing: "primary"
    };
    return statusColors[status] || "default";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto my-8 max-w-4xl">
        <Card>
          <CardBody className="flex items-center justify-center p-8">
            <div className="text-center">
              <Icon icon="solar:danger-circle-bold" className="w-12 h-12 text-danger mb-4" />
              <p className="text-lg">Failed to load orders: {error}</p>
              <Button color="primary" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto my-8 max-w-4xl">
        <Card>
          <CardBody className="flex items-center justify-center p-8">
            <div className="text-center">
              <Icon icon="solar:box-minimalistic-linear" className="w-12 h-12 text-default-400 mb-4" />
              <p className="text-lg">No orders found</p>
              <Button color="primary" className="mt-4" onClick={() => navigate('/models')}>
                Start Shopping
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              onClick={handleBack}
              className="text-default-500"
            >
              <Icon icon="solar:arrow-left-linear" className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold">Order History</h1>
          </div>
          <Chip color="primary" variant="flat">
            {orders.length} Orders
          </Chip>
        </CardHeader>
      </Card>

      <Accordion variant="bordered" className="space-y-4">
        {orders.map((order) => {
          const customerDetails: CustomerDetails = JSON.parse(order.customerDetails);
          const paymentDetails: PaymentDetails = JSON.parse(order.paymentDetails);
          const items: OrderItem[] = JSON.parse(order.items);

          return (
            <AccordionItem
              key={order.id}
              aria-label={`Order #${order.id}`}
              title={
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Order #{order.id}</span>
                    <Chip color={getStatusColor(order.status)} variant="flat">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Chip>
                  </div>
                  <span className="text-small text-default-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              }
            >
              <div className="px-2">
                {/* Create a two-column grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Order Details and Customer Details */}
                  <div>
                    {/* Order Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                      <div className="space-y-2">
                        <p>
                          <span className="text-default-500">Total Amount:</span> ${order.totalPrice.toLocaleString()}
                        </p>
                        <p>
                          <span className="text-default-500">Payment Method:</span>{' '}
                          {paymentDetails.method.charAt(0).toUpperCase() + paymentDetails.method.slice(1)}
                        </p>
                        <p>
                          <span className="text-default-500">Payment Mode:</span>{' '}
                          {paymentDetails.mode.charAt(0).toUpperCase() + paymentDetails.mode.slice(1)}
                        </p>
                        {paymentDetails.reservationAmount && (
                          <p>
                            <span className="text-default-500">Reservation Amount:</span>{' '}
                            ${paymentDetails.reservationAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <Divider className="my-6" />

                    {/* Customer Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
                      <div className="space-y-2">
                        <p>
                          <span className="text-default-500">Name:</span> {customerDetails.firstName} {customerDetails.lastName}
                        </p>
                        <p>
                          <span className="text-default-500">Email:</span> {customerDetails.email}
                        </p>
                        <p>
                          <span className="text-default-500">Phone:</span> {customerDetails.phone}
                        </p>
                        <p>
                          <span className="text-default-500">Address:</span> {customerDetails.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Car Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ordered Cars</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {items.map((item, index) => (
                        <Card key={index} shadow="sm">
                          <CardBody className="p-0">
                            {item.carDetails?.img && (
                              <img
                                src={item.carDetails.img}
                                alt={item.carDetails.title || `Car ${item.carId}`}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <h4 className="text-lg font-semibold">
                                {item.carDetails?.title || `Car ID: ${item.carId}`}
                              </h4>
                              {item.carDetails?.trim && (
                                <p className="text-small text-default-500">{item.carDetails.trim}</p>
                              )}
                              {item.carDetails?.description && (
                                <p className="text-small mt-2">{item.carDetails.description}</p>
                              )}
                              <p className="text-danger text-lg mt-2">${item.totalPrice.toLocaleString()}</p>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
          
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default OrderHistory;
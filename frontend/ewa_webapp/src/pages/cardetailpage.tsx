import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

type Car = {
    id: number,
    title: string;
    img: string;
    price: string;
    description: string;
    trim: string; // Added trim field
};

export default function CarDetailPage(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const car = location.state?.car;

    if (!car) {
        return (
            <DefaultLayout>
                <div className="text-center mt-8">No car details available.</div>
                <Button onPress={() => navigate(-1)} className="mt-4">Go Back</Button>
            </DefaultLayout>
        );
    }

    const handleAddToCart = (car: Car) => {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = [...cartItems, car]; 
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert(`${car.title} has been added to the cart.`);
    };

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center mt-8 px-8">
                <Card className="w-full max-w-[600px]">
                    <CardBody className="p-0">
                        <img
                            style={{ objectFit: "cover", width: "100%", height: "300px", borderRadius: "8px" }}
                            src={car.img}
                            alt={car.title}
                        />
                        <h2 className="p-4 text-2xl font-semibold">{car.title}</h2>
                        <p className="p-4 text-lg text-default-500">{car.trim || "No trim available"}</p>
                        <p className="p-4 text-base">{car.description}</p>
                    </CardBody>
                    <CardFooter className="text-base justify-between">
                        <p style={{ color: "#E42638", fontSize: "1.2rem" }}>{car.price}</p>
                        <Button size="sm" color="primary" onClick={() => handleAddToCart(car)}>
          Buy Car
        </Button>
                        <Button onPress={() => navigate(-1)}>Go Back</Button>
                    </CardFooter>
                </Card>
            </section>
        </DefaultLayout>
    );
}

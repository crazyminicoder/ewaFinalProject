import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { MdOutlinePriceCheck, MdOutlineElectricCar, MdLocalGasStation, MdAirlineSeatReclineNormal, MdOutlineBuild, MdOutlineColorLens, MdOutlineDirectionsCar } from "react-icons/md"; // Material Icons for various attributes
import { toast, ToastContainer } from "react-toastify";

type Car = {
    id: number;
    title: string;
    img: string;
    price: string;
    description: string;
    trim: string;
    year: number;
    engineType: string;
    horsepower: string;
    transmission: string;
    fuelEfficiency: string;
    seatingCapacity: number;
    colors: string;
};

export default function CarDetailPage(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const car = location.state?.car;

    if (!car) {
        return (
            <DefaultLayout>
                <div className="text-center mt-8">No car details available.</div>
                <Button onPress={() => navigate(-1)} size="sm" className="mt-4">Go Back</Button>
            </DefaultLayout>
        );
    }

    const handleAddToCart = (car: Car) => {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = [...cartItems, car]; 
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        // Display toast notification instead of alert
        toast.success(`${car.title} has been added to the cart!`, {
            position: "bottom-right",
            autoClose: 2000, // Auto-close after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
    };

    return (
        <DefaultLayout>
            <ToastContainer theme="dark" />
            <section className="flex flex-col md:flex-row items-center mt-8 px-8 gap-8">
                {/* Left Image Section */}
                <div className="flex-shrink-0 w-full md:w-1/2">
                    <img
                        style={{ objectFit: "cover", width: "100%", height: "300px", borderRadius: "8px" }}
                        src={car.img}
                        alt={car.title}
                    />
                </div>

                {/* Right Details Section */}
                <div className="flex-grow w-full md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-4">{car.title} ({car.year})</h2>
                    <ul className="list-none space-y-4">
                        <li className="flex items-center gap-4">
                            <MdOutlinePriceCheck className="text-2xl" />
                            <span className="text-lg">{car.price}</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <MdOutlineBuild className="text-2xl" />
                            <span className="text-lg">Trim: {car.trim || "N/A"}</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <MdOutlineElectricCar className="text-2xl" />
                            <span className="text-lg">Engine: {car.engineType || "N/A"}</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <MdOutlineDirectionsCar className="text-2xl" />
                            <span className="text-lg">Transmission: {car.transmission || "N/A"}</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <MdLocalGasStation className="text-2xl" />
                            <span className="text-lg">Fuel Efficiency: {car.fuelEfficiency || "N/A"}</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <MdAirlineSeatReclineNormal className="text-2xl" />
                            <span className="text-lg">Seating Capacity: {car.seatingCapacity || "N/A"}</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <MdOutlineColorLens className="text-2xl" />
                            <span className="text-lg">Available Colors: {car.colors || "N/A"}</span>
                        </li>
                    </ul>
                    <p className="mt-4 text-lg">{car.description}</p>

                    <div className="mt-6 flex gap-4">
                        <Button size="md" color="primary" onClick={() => handleAddToCart(car)}>
                            Reserve Car
                        </Button>
                        <Button size="md" onPress={() => navigate(-1)}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
}

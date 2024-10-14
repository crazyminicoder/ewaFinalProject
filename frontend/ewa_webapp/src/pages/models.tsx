import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Card, CardBody, CardFooter, Pagination, Input } from "@nextui-org/react"; 
import { Spinner } from "@nextui-org/spinner";
import DefaultLayout from "@/layouts/default";
import axios from 'axios';

type Car = {
    title: string;
    img: string;
    price: string;
    description: string;
};

export default function ModelsPage(): JSX.Element {
    const { make } = useParams<{ make: string }>(); // Grabbing the make from URL params
    const [models, setModels] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const url = make ? `http://localhost:3000/api/cars?make=${make}` : `http://localhost:3000/api/cars`;
                const response = await axios.get(url, {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    setModels(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                    throw new Error(`Unexpected response format. Expected array, got ${typeof response.data}`);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(`Error fetching data: ${error.response?.data?.error || error.message}`);
                } else {
                    setError(error instanceof Error ? error.message : 'An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, [make]); // Fetch models whenever the make changes

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = models.filter(model => model.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(models.length / itemsPerPage);

    return (
        <DefaultLayout>
            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <Input
                    isClearable
                    type="text"
                    label={`Search for ${make ? `${make} ` : ""}Models`} // Dynamically set label based on the make
                    variant="bordered"
                    placeholder={`Enter ${make ? `${make} ` : ""}model`} // Placeholder changes based on make
                    className="w-full max-w-[80%] lg:max-w-[2300px]"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Card Grid Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8">
                {loading ? (
                    <div className="col-span-3 flex justify-center items-center h-40">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="col-span-3 text-red-500 text-center">{error}</div>
                ) : currentItems.length === 0 ? (
                    <div className="col-span-3 text-center">No items found</div>
                ) : (
                    currentItems.map((item, index) => (
                        <Card shadow="sm" key={index} isPressable onPress={() => console.log("Item clicked:", item.title)}>
                            <CardBody className="p-0">
                                <img
                                    style={{ objectFit: "cover", width: "100%", height: "200px", borderRadius: "8px" }}
                                    src={item.img}
                                    alt={item.title}
                                />
                                <h3 className="p-2 text-lg font-semibold">{item.title}</h3>
                                <p className="p-2 text-small">{item.description}</p>
                            </CardBody>
                            <CardFooter className="text-small justify-between">
                                <p className="text-default-500">{item.price}</p>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </section>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <Pagination
                    total={totalPages}
                    initialPage={1}
                    onChange={(page: number) => setCurrentPage(page)}
                />
            </div>
        </DefaultLayout>
    );
}

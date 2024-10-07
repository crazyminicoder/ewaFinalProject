import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Pagination } from "@nextui-org/react"; 
import { Spinner } from "@nextui-org/spinner";
import DefaultLayout from "@/layouts/default";
import axios from 'axios';
import { Input } from "@nextui-org/react";

type Item = {
    title: string;
    img: string;
    price: string;
    description: string;
};

export default function IndexPage(): JSX.Element {
    const [list, setList] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/cars', {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    setList(response.data);
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

        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(list.length / itemsPerPage);

    return (
        <DefaultLayout>
            {/* Video Banner */}
            <div className="w-full h-[500px] mb-8 overflow-hidden">
                <video
                    src="https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4"
                    width="100%"
                    height="500px"
                    muted
                    autoPlay
                    loop
                    style={{ objectFit: "cover", maxHeight: "500px", borderRadius: "20px" }}
                />
            </div>

            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <Input
                    isClearable
                    type="text"
                    label="Search for Cars"
                    variant="bordered"
                    placeholder="Enter car make or model"
                    className="w-full max-w-[80%] lg:max-w-[2300px]"
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

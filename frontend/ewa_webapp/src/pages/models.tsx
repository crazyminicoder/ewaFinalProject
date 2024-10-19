import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Card, CardBody, CardFooter, Pagination, Input, Skeleton } from "@nextui-org/react"; 
import DefaultLayout from "@/layouts/default";
import axios from 'axios';

type Car = {
    title: string;
    img: string;
    price: string;
    description: string;
    trim: string; // Added trim field
};

export default function ModelsPage(): JSX.Element {
    const { make } = useParams<{ make: string }>();
    const [models, setModels] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentMakePage, setCurrentMakePage] = useState<number>(1);
    const [currentOtherPage, setCurrentOtherPage] = useState<number>(1);
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
    }, [make]);

    // Filter arrays
    const filteredByMake = models.filter(model => 
        model.title.toLowerCase().includes(make?.toLowerCase() || "") && 
        model.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const filteredByOtherMakes = models.filter(model => 
        !model.title.toLowerCase().includes(make?.toLowerCase() || "") && 
        model.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Separate pagination for each section
    const makeStartIndex = (currentMakePage - 1) * itemsPerPage;
    const otherStartIndex = (currentOtherPage - 1) * itemsPerPage;
    
    const currentItemsByMake = filteredByMake.slice(makeStartIndex, makeStartIndex + itemsPerPage);
    const currentItemsByOtherMakes = filteredByOtherMakes.slice(otherStartIndex, otherStartIndex + itemsPerPage);

    const totalPagesByMake = Math.ceil(filteredByMake.length / itemsPerPage);
    const totalPagesByOtherMakes = Math.ceil(filteredByOtherMakes.length / itemsPerPage);

    // Card component to reduce duplication
    const CarCard = ({ item }: { item: Car }) => (
        <Card shadow="sm" isPressable onPress={() => console.log("Item clicked:", item.title)}>
            <CardBody className="p-0">
                <img
                    style={{ objectFit: "cover", width: "100%", height: "200px", borderRadius: "8px" }}
                    src={item.img}
                    alt={item.title}
                />
                <h3 className="p-2 text-lg font-semibold">{item.title}</h3>
                <p className="p-2 text-small text-default-500">{item.trim || "No trim available"}</p> {/* Display trim */}
                <p className="p-2 text-small">{item.description}</p>
            </CardBody>
            <CardFooter className="text-small justify-between">
                <p className="text-default-500">{item.price}</p>
            </CardFooter>
        </Card>
    );

    // Skeleton loading component
    const SkeletonCard = () => (
        <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
            </div>
        </Card>
    );

    return (
        <DefaultLayout>
            <div className="mb-8 flex justify-center">
                <Input
                    isClearable
                    type="text"
                    label={`Search for ${make ? `${make} ` : ""}Models`}
                    variant="bordered"
                    placeholder={`Enter ${make ? `${make} ` : ""}model`}
                    className="w-full max-w-[80%] lg:max-w-[2300px]"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Make Models Section */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8">
                <h3 className="col-span-3 text-lg font-semibold">{make} Models</h3>
                {loading ? (
                    <>
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </>
                ) : error ? (
                    <div className="col-span-3 text-red-500 text-center">{error}</div>
                ) : currentItemsByMake.length === 0 ? (
                    <div className="col-span-3 text-center">No items found for {make}</div>
                ) : (
                    currentItemsByMake.map((item, index) => (
                        <CarCard key={index} item={item} />
                    ))
                )}
            </section>

            {filteredByMake.length > 0 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        total={totalPagesByMake}
                        initialPage={1}
                        onChange={setCurrentMakePage}
                    />
                </div>
            )}

            {/* Other Makes Section */}
            {filteredByOtherMakes.length > 0 && (
                <>
                    <h3 className="col-span-3 text-lg font-semibold mt-8 px-8">Other Models</h3>
                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8">
                        {currentItemsByOtherMakes.map((item, index) => (
                            <CarCard key={index} item={item} />
                        ))}
                    </section>

                    <div className="flex justify-center mt-6">
                        <Pagination
                            total={totalPagesByOtherMakes}
                            initialPage={1}
                            onChange={setCurrentOtherPage}
                        />
                    </div>
                </>
            )}
        </DefaultLayout>
    );
}

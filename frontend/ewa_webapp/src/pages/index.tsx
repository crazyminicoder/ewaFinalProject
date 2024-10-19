import { useEffect, useState } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import DefaultLayout from "@/layouts/default";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import kiaLogo from '../assets/logos/kia.png';
import hondaLogo from '../assets/logos/honda.png';
import bmwLogo from '../assets/logos/bmw.png';
import hyundaiLogo from '../assets/logos/hyundai.png';
import porscheLogo from '../assets/logos/porsche.png';
import acuraLogo from '../assets/logos/acura.png';
import teslaLogo from '../assets/logos/tesla.png';
import audiLogo from '../assets/logos/audi.png';
import lexusLogo from '../assets/logos/lexus.png';
import toyotaLogo from '../assets/logos/toyota.png';
import fordLogo from '../assets/logos/ford.png';
import mercedesBenzLogo from '../assets/logos/mercedes-benz-alt.png';
import styled, { keyframes } from 'styled-components';

type Item = {
    title: string;
    description: string;
};

// Keyframes for the moving background
const moveBackground = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Keyframes for floating elements
const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const AnimatedBackground = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, #1a1a1a, #2c2c2c, #3d3d3d, #1a1a1a);
  background-size: 400% 400%;
  animation: ${moveBackground} 15s ease infinite;
  filter: blur(20px);
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  animation: ${float} 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 20%;
    right: 20%;
    animation-delay: 1s;
  }

  &:nth-child(3) {
    bottom: 30%;
    left: 30%;
    animation-delay: 2s;
  }

  &:nth-child(4) {
    bottom: 10%;
    right: 10%;
    animation-delay: 3s;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BlurredCard = styled(Card)`
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// Keyframes for slower fade-in animation
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

// Make the fade-in slower by adjusting the duration (e.g., 3 seconds)
const FadeInDiv = styled.div`
  animation: ${fadeIn} ease 4s; /* 3s for slower fade-in */
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

const carLogos: { [key: string]: string } = {
    'KIA': kiaLogo,
    'Honda': hondaLogo,
    'BMW': bmwLogo,
    'Hyundai': hyundaiLogo,
    'Porsche': porscheLogo,
    'Acura': acuraLogo,
    'Tesla': teslaLogo,
    'Audi': audiLogo,
    'Lexus': lexusLogo,
    'Toyota': toyotaLogo,
    'Ford': fordLogo,
    'Mercedes-Benz': mercedesBenzLogo,
};

export default function IndexPage() {
    const [list, setList] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch car makes data
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/car-makes', {
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    setList(response.data);
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

        fetchData();
    }, []);

    const handleCardClick = (make: string) => {
        navigate(`/models/${make}`);
    };

    return (
        <DefaultLayout>
            <FadeInDiv>
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

                {/* Floating Elements Section */}
                <div className="mb-8 relative overflow-hidden" style={{ height: '120px' }}>
                    <AnimatedBackground />
                    <FloatingElement />
                    <FloatingElement />
                    <FloatingElement />
                    <FloatingElement />
                    <Overlay />
                    <BlurredCard className="absolute inset-0 z-10">
                        <CardBody className="p-6 text-center">
                            <h2 className="text-2xl font-bold text-white">Explore the most popular car brands</h2>
                            <p className="text-lg mt-2 text-gray-200">Get your dream car from our wide collection of car makes and models.</p>
                        </CardBody>
                    </BlurredCard>
                </div>

                {/* Card Grid Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : list.length === 0 ? (
                    <div className="text-center">No items found</div>
                ) : (
                    <div className="mx-auto gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {list.map((item, index) => (
                            <Card 
                                key={index} 
                                className="h-[220px] relative flex flex-col justify-center items-center rounded-[30px]"  
                                isPressable  
                                onPress={() => handleCardClick(item.title)} 
                                style={{
                                    borderRadius: '30px', 
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
                                    overflow: 'hidden',
                                    transition: 'transform 0.8s', 
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}  
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} 
                            >
                                <div className="flex justify-center items-center h-full">
                                    <div
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            background: `linear-gradient(90deg, #f2123b, #f23125, #f3446c)`,
                                            WebkitMaskImage: `url(${carLogos[item.title] || '/path/to/default-image.svg'})`,
                                            WebkitMaskSize: 'contain',
                                            WebkitMaskRepeat: 'no-repeat',
                                            WebkitMaskPosition: 'center',
                                            maskImage: `url(${carLogos[item.title] || '/path/to/default-image.svg'})`,
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'center',
                                        }}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </FadeInDiv>
        </DefaultLayout>
    );
}

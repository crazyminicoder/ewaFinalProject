import { Card, CardBody, CardFooter } from "@nextui-org/react"; // Correct imports from NextUI
import DefaultLayout from "@/layouts/default"; // Layout component for your page

// Item type definition
type Item = {
  title: string;
  img: string;
  price: string;
  description: string;
};

const list: Item[] = [
  { 
    title: "Toyota Camry", 
    img: "https://www.mad4wheels.com/img/free-car-images/mobile/21063/toyota-camry-se-awd-2025-760556.jpg", 
    price: "$25,000", 
    description: "A reliable mid-size sedan with a 2.5L 4-cylinder engine, offering 203 horsepower and excellent fuel economy at 28 MPG city / 39 MPG highway."
  },
  { 
    title: "Ford Mustang", 
    img: "https://www.mad4wheels.com/img/free-car-images/mobile/19817/ford-mustang-2024-685510.jpg", 
    price: "$35,000", 
    description: "A classic American muscle car with a 5.0L V8 engine delivering 450 horsepower, perfect for speed enthusiasts. 0-60 mph in under 4 seconds."
  },
  { 
    title: "Tesla Model 3", 
    img: "https://www.mad4wheels.com/img/free-car-images/mobile/20650/tesla-model-3-2024-735780.jpg", 
    price: "$40,000", 
    description: "An all-electric sedan offering a range of up to 353 miles per charge. Features autopilot, a sleek interior design, and top-notch acceleration (0-60 mph in 3.1 seconds)."
  },
  { 
    title: "Honda Civic", 
    img: "https://www.mad4wheels.com/img/free-car-images/mobile/21134/honda-civic-2025-765235.jpg", 
    price: "$22,500", 
    description: "A compact sedan with a 1.5L turbocharged engine, known for its durability and fuel efficiency. 30 MPG city / 38 MPG highway."
  },
  { 
    title: "Chevrolet Silverado", 
    img: "https://www.mad4wheels.com/img/free-car-images/mobile/20304/chevrolet-silverado-hd-zr2-2024-718033.jpg", 
    price: "$45,000", 
    description: "A powerful full-size pickup truck with a 6.2L V8 engine, providing 420 horsepower and 460 lb-ft of torque. Ideal for towing and off-road adventures."
  },
  { 
    title: "BMW 3 Series", 
    img: "https://www.mad4wheels.com/img/free-car-images/mobile/21150/bmw-3-series-g20-sedan-2025-766240.jpg", 
    price: "$41,250", 
    description: "A luxury compact sedan with a 2.0L turbocharged engine delivering 255 horsepower. Known for its premium features and smooth driving experience."
  },
];


export default function IndexPage(): JSX.Element {
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
          style={{ objectFit: "cover", maxHeight: "500px", borderRadius: "20px" }} // Added border-radius here
        />
      </div>


      {/* Card Grid Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-8">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable onPress={() => console.log("Item clicked:", item.title)}>
            <CardBody className="p-0">
              <img
                style={{ objectFit: "cover", width: "100%", height: "200px", borderRadius: "8px" }}
                src={item.img}
                alt={item.title}
              />
              <p className="p-2 text-small">{item.description}</p> {/* Displaying description */}
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </section>
    </DefaultLayout>
  );
}

import { Card, CardBody, CardFooter } from "@nextui-org/react"; // Correct imports from NextUI
import DefaultLayout from "@/layouts/default"; // Layout component for your page

// Item type definition
type Item = {
  title: string;
  img: string;
  price: string;
};

const list: Item[] = [
  { title: "Orange", img: "https://nextui.org/images/fruit-1.jpeg", price: "$5.50" },
  { title: "Tangerine", img: "https://nextui.org/images/fruit-4.jpeg", price: "$3.00" },
  { title: "Raspberry", img: "https://nextui.org/images/fruit-3.jpeg", price: "$10.00" },
  { title: "Lemon", img: "https://nextui.org/images/fruit-4.jpeg", price: "$5.30" },
  { title: "Avocado", img: "https://nextui.org/images/fruit-7.jpeg", price: "$15.70" },
  { title: "Banana", img: "https://nextui.org/images/fruit-7.jpeg", price: "$7.50" },
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

"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/react";
import React from "react"; // Import React to ensure TypeScript works correctly

type Item = {
  title: string;
  img: string;
  price: string;
};

export default function App(): JSX.Element {
  const list: Item[] = [
    {
      title: "Orange",
      img: "https://nextui.org/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      title: "Tangerine",
      img: "https://nextui.org/images/fruit-4.jpeg",
      price: "$3.00",
    },
    {
      title: "Raspberry",
      img: "https://nextui.org/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      title: "Lemon",
      img: "https://nextui.org/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      title: "Avocado",
      img: "https://nextui.org/images/fruit-7.jpeg",
      price: "$15.70",
    },
    {
      title: "Lemon 2",
      img: "https://nextui.org/images/fruit-2.jpeg",
      price: "$8.00",
    },
    {
      title: "Banana",
      img: "https://nextui.org/images/fruit-7.jpeg",
      price: "$7.50",
    },
    {
      title: "Watermelon",
      img: "https://nextui.org/images/fruit-8.jpeg",
      price: "$12.20",
    },
  ];

  return (
    <div className="overflow-y-auto">
      {/* Banner Video */}
      <div className="w-full h-[500px] mb-8 overflow-hidden"> {/* Increase video height */}
        <video
          src="https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4"
          width="100%"
          height="500px"  
          muted
          autoPlay
          loop
          style={{ objectFit: "cover", maxHeight: "500px" }}
        />
      </div>

      {/* Cards Grid */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3"> {/* Set to 3 cards per row */}
        {list.slice(0, 6).map((item, index) => (  // Limit to 6 cards (2 rows of 3 cards)
          <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
            <CardBody className="overflow-visible p-0">
              <img
                style={{ objectFit: "cover", width: "100%", height: "200px", borderRadius: "8px" }} 
                src={item.img}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

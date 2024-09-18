"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { Image } from "@nextui-org/image"; // Ensure correct import for NextUI Image component
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
    <div className="overflow-y-auto"> {/* Ensure page is scrollable */}
      {/* Banner Image */}
      <div className="w-full h-[300px] mb-8 overflow-hidden"> {/* Set a fixed height for the image */}
        <Image
          src="https://images.unsplash.com/photo-1469285994282-454ceb49e63c?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Banner"
          width="100%"
          height="300px" 
          radius="none"
          shadow="lg"
          style={{ objectFit: 'cover', maxHeight: '300px' }}
        />
      </div>

      {/* Cards Grid */}
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable onPress={() => console.log("item pressed")}>
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.title}
                className="w-full object-cover h-[140px]"
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

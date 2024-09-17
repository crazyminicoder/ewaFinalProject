import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./carousel.css";
// import PropTypes from "prop-types";

export  function Carousel({ arrayOfImagesUrl }) {
  const [current, setCurrent] = useState(1);
  const [translateValue, setTranslateValue] = useState(0);
  const length = arrayOfImagesUrl.length;

  const imagesArr = arrayOfImagesUrl.map((itemURL, index) => {
    return <img key={index} src={itemURL} className="image" alt="" />;
  });

  const nextSlide = () => {
    if (current !== length) {
      setCurrent(current + 1);
      setTranslateValue(-current * 100);
    }
  };

  const prevSlide = () => {
    if (current !== 1) {
      setCurrent(current - 1);
      setTranslateValue((length - current - 1) * 100);
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      if (current !== length) {
        nextSlide();
      } else {
        setCurrent(1);
        setTranslateValue(0)
      }
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [current]);

  return (
    <div className="slider">
      <div
        className="carouselImage-container"
        style={{ transform: `translateX(${translateValue}%)` }}
      >
        {imagesArr}
      </div>
      <FaChevronLeft className="left-arrow" onClick={prevSlide} />
      <FaChevronRight className="right-arrow" onClick={nextSlide} />
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { TextRoll } from "../ui/text-roll";

export const AnimatedCarousel = ({
  title = "Ecossistema W3: Aprovado pelos gigantes",
  autoPlay = true,
  autoPlayInterval = 3000,
  logos = null, 
  containerClassName = "",
  padding = "py-20",
}) => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || !autoPlay) {
      return;
    }

    const timer = setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, autoPlayInterval);

    return () => clearTimeout(timer);
  }, [api, current, autoPlay, autoPlayInterval]);

  const logoItems = logos || [
    { src: "/images/logo-mentoria.svg", alt: "Mentoria Ames" },
    { src: "/images/logo-trafego.svg", alt: "W3 Tráfego" },
    { src: "/images/logo-marketplace.svg", alt: "W3 Marketplaces" },
    { src: "/images/logo-pagamentos.svg", alt: "W3 Pagamentos" },
    { src: "/images/logo-saas.svg", alt: "W3 Labs" },
  ];

  return (
    <div className={`w-full ${padding} bg-transparent relative z-10 ${containerClassName}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-3xl tracking-tighter lg:max-w-xl font-bold text-center mx-auto mb-16 text-white uppercase">
          <TextRoll>{title}</TextRoll>
        </h2>
          
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-4">
            {logoItems.map((logo, index) => (
              <CarouselItem className="basis-1/2 md:basis-1/4 lg:basis-1/5 pl-4" key={index}>
                <div className="flex glass-panel rounded-2xl h-24 items-center justify-center p-6 hover:border-[#F55900]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,89,0,0.15)] group transform hover:-translate-y-1">
                  <img 
                    src={logo.src}
                    alt={logo.alt}
                    className="h-10 w-auto object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

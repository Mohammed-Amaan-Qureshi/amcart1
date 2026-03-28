"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";

function CategorySlider() {

  const navigate = useRouter()

  const categories = [
    { label: "Fashion & Lifestyle", icon: "👗" },
    { label: "Electronics & Gadgets", icon: "📱" },
    { label: "Home & Living", icon: "🏡" },
    { label: "Beauty & Personal Care", icon: "💄" },
    { label: "Toys, Kids & Baby", icon: "🧸" },
    { label: "Food & Grocery", icon: "🛒" },
    { label: "Sports & Fitness", icon: "🏀" },
    { label: "Automotive Accessories", icon: "🚗" },
    { label: "Gifts & Handcrafts", icon: "🎁" },
    { label: "Books & Stationery", icon: "📚" },
  ];

  return (
    <div>
      {/* <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
        className="w-[90%] mx-auto bg-black"
      >
        <CarouselContent>
          {cateogries.map((cateo, index) => (
            <CarouselItem key={index}>
              <div className="p-6 bg-muted rounded-xl text-center">
                <h1 className="text-2xl">{cateo.icon}</h1>
                <h2 className="text-lg font-semibold">{cateo.label}</h2>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        className="w-screen mt-5 md:w-[90%] mx-auto"
      >
        <CarouselContent className="-ml-1 ">
          {categories.map((cateo, index) => (
            <CarouselItem key={index} className="basis-1/2 pl-1 lg:basis-1/3 ">
              <div className="p-1">
                <Card className="bg-black h-40 text-white">
                  <CardContent 
                  onClick={()=> navigate.push(`/cateogry?cateogry=${encodeURIComponent(cateo.label)}`)}
                  className="flex flex-col items-center justify-center p-6 cursor-pointer">
                    <h1 className="text-2xl">{cateo.icon}</h1>
                <h2 className="text-lg text-center font-semibold">{cateo.label}</h2>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>
    </div>
  );
}

export default CategorySlider;

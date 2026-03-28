"use client";
import React, { useEffect, useState } from "react";
import slide1 from "@/assets/slide1.jpg";
import slide2 from "@/assets/slide2.jpg";
import slide3 from "@/assets/slide3.jpg";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

function Slide() {
  const [current, setCurrent] = useState<number>(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrent((prev)=> (prev+1) % slides.length )

      return ()=>{
        clearInterval(interval)
      }
    },4000)
  },[])

  const slides = [
    {
      image: slide1,
      title: "STYLE & COMFORT",
      subtitle: "BANG",
      description: "Move on the beat",
      button: "Discover",
    },
    {
      image: slide2,
      title: "WEAR & COMFORT",
      subtitle: "RUN>>>",
      description: "Run like a beast",
      button: "Discover",
    },
    {
      image: slide3,
      title: "FRAGRANCE OF HEVEN",
      subtitle: "REFRESHING",
      description: "Smell the beauty of the World",
      button: "Discover",
    },
  ];

  return (
    <div className="font-serif relative w-full min-h-[85vh] mt-17 md:mt-20 pt-0 top-0 overflow-hidden bg-transparent">
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className=" absolute inset-0 flex justify-center items-center"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            className="object-contain opacity-70"
            fill
          />

          <div className=" absolute inset-0 flex flex-col justify-center px-10 md:px-24 bg-linear-to-r from-black/40 to-transparent">

          <motion.h3 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="text-sm md:text-base  uppercase tracking-widest text-gray-300">

              {slides[current].subtitle}

            </motion.h3>

          <motion.h1 
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.4}}
            className="text-4xl md:text-6xl  uppercase tracking-widest text-gray-300">

              {slides[current].description}

            </motion.h1>

          <motion.p 
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.6}}
            className="text-lg md:text-xl  uppercase tracking-widest text-gray-300">

              {slides[current].title}

            </motion.p>

            <motion.button 
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className="px-6 py-3 w-fit bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition">

                {slides[current].button}

                </motion.button>

          </div>
        </motion.div>
      </AnimatePresence>

      <div className=" absolute bottom-6 right-6 flex gap-4">
        {
          slides.map((sld,index)=>(
            <motion.div 
              key={index}
              whileHover={{scale: 1.1}}
              onClick={()=> setCurrent(index)}
              className={`relative w-20 h-12 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === current ? "border-gray-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]" :
              "border-gray-500 hover:border-blue-400"
             }`}>

              <Image src={sld.image} alt={sld.title} fill className="object-contain opacity-90" />

              </motion.div>
          ))
        }
      </div>

    </div>
  );
}

export default Slide;

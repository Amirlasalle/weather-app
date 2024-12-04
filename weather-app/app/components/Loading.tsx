"use client";
import React from "react";
import { motion } from "motion/react";

interface LoadingProps {
  containerClassName?: string;
  logoClassName?: string;
  srcOne?: string;
  altOne?: string;
  srcTwo?: string;
  altTwo?: string;
  srcThree?: string;
  altThree?: string;
  srcFour?: string;
  altFour?: string;
  once?: boolean;
}

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const loadingLogo = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
      },
      opacity: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
      },
    },
  },
};

const Loading: React.FC<LoadingProps> = ({
  containerClassName = "",
  logoClassName = "",
  srcOne = "",
  altOne = "",
  srcTwo = "",
  altTwo = "",
  srcThree = "",
  altThree = "",
  srcFour = "",
  altFour = "",
}: LoadingProps) => {
  return (
    <motion.div
      className={`${containerClassName} w-full h-full grid justify-center items-center grid-cols-2 grid-rows-2 gap-0 m-0 list-none bg-white/20`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-end items-end w-full h-full p-2">
        <motion.img
          className={`${logoClassName}`}
          variants={loadingLogo}
          src={srcOne}
          alt={altOne}
        />
      </div>
      <div className="flex justify-start items-end w-full h-full p-2">
        <motion.img
          className={`${logoClassName}`}
          variants={loadingLogo}
          src={srcTwo}
          alt={altTwo}
        />
      </div>
      <div className="flex justify-end items-start w-full h-full p-2">
        <motion.img
          className={`${logoClassName}`}
          variants={loadingLogo}
          src={srcThree}
          alt={altThree}
        />
      </div>
      <div className="flex justify-start items-start w-full h-full p-2">
        <motion.img
          className={`${logoClassName}`}
          variants={loadingLogo}
          src={srcFour}
          alt={altFour}
        />
      </div>
    </motion.div>
  );
};

export default Loading;

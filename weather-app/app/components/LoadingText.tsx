"use client";
import React from "react";
import { motion } from "motion/react";

interface LoadingTextProps {
  containerClassName?: string;
  className?: string;
  text?: string;
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

const LoadingTexts = {
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

const LoadingText: React.FC<LoadingTextProps> = ({
  containerClassName = "",
  className = "",
  text = "",
}: LoadingTextProps) => {
  return (
    <motion.div
      className={`${containerClassName} w-full h-full flex justify-center items-center list-none bg-white/20 py-3`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-end items-end w-full h-full p-2">
        <motion.p
          className={`${className}`}
          variants={LoadingTexts}
        >
          {text}
        </motion.p>
      </div>
  
    </motion.div>
  );
};

export default LoadingText;

import { motion } from 'framer-motion';

const Title = () => {
  return (
    <div className="w-full flex justify-center">
      <motion.div
        animate={{
          rotate: [0, -1, 1, -1, 1, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="glass p-2 mb-4 text-3xl font- text-center w-fit"
      >
        AI Research Agent 🤖
      </motion.div>
    </div>
  );
};

export default Title;
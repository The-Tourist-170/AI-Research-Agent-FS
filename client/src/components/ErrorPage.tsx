import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef } from 'react';

const ErrorPage = () => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { duration: 0.3, type: 'spring' });
    animate(y, 0, { duration: 0.3, type: 'spring' });
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" error-glass p-6 rounded-lg text-center text-white w-fit"
      >
        <div style={{ transform: 'translateZ(50px)' }} className="text-5xl mb-4" role="img" aria-label="Sad Robot">
          🤖
        </div>
        <h2 style={{ transform: 'translateZ(40px)' }} className="text-2xl font-bold text-red-400 mb-2">
          Oops! API Limit Reached
        </h2>
        <p style={{ transform: 'translateZ(30px)' }} className="text-gray-300 mb-1">
          The free tier limit for the Gemini AI API has been exceeded.
        </p>
        <p style={{ transform: 'translateZ(20px)' }} className="text-gray-400">
          Please try again later.
        </p>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
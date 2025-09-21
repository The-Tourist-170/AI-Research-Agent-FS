import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  useState,
  useRef,
  useLayoutEffect,
  type ReactNode,
  type MouseEvent,
} from 'react';


const LOUPE_SIZE = 100; 
const MAGNIFICATION = 2;
const BLUR_AMOUNT = 8;

interface MagnifyingDivProps {
  children: ReactNode;
  className?: string;
}

const MagnifyingDiv = ({ children, className }: MagnifyingDivProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showLoupe, setShowLoupe] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);
    updateSize();

    return () => resizeObserver.disconnect();
  }, []);

  const transformX = useTransform(
    mouseX,
    (val) => (LOUPE_SIZE / 2) - val * MAGNIFICATION
  );
  const transformY = useTransform(
    mouseY,
    (val) => (LOUPE_SIZE / 2) - val * MAGNIFICATION
  );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowLoupe(true)}
      onMouseLeave={() => setShowLoupe(false)}
    >
      {children}
      <motion.div
        style={{
          display: showLoupe ? 'block' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%',
          width: LOUPE_SIZE,
          height: LOUPE_SIZE,
          borderRadius: '100%',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            width: size.width,
            height: size.height,
            translateX: transformX,
            translateY: transformY,
            scale: MAGNIFICATION,
            transformOrigin: 'top left',
            filter: `blur(${BLUR_AMOUNT}px)`, 
          }}
        >
          {children}
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            width: size.width,
            height: size.height,
            translateX: transformX,
            translateY: transformY,
            scale: MAGNIFICATION,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MagnifyingDiv;
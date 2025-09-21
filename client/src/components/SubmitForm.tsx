import { useForm } from 'react-hook-form';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

type FormData = {
  topic: string;
};

function SubmitForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [limitError, SetLimitError] = useState(false);

  const ref = useRef<HTMLFormElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-250, 250], [-8, 8]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { duration: 0.3, type: 'spring' });
    animate(y, 0, { duration: 0.3, type: 'spring' });
  };

  const test = async () => {
    const res = await fetch('https://localhost:3000/check');
    if (res.status === 429) {
      console.log('Free tier limit exceeded');
      SetLimitError(true);
    } else {
      console.log('Another Error: Some not important pre-flight test error.', await res.json());
    }
  };

  test();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://localhost:3000/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: data.topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      const result = await response.json();
      navigate(`/tasks/${result.id}`);
    } catch {
      setError('Error submitting topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className='mt-20 flex justify-center items-center'
        style={{ perspective: '1000px' }}
      >
        <motion.form
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          onSubmit={handleSubmit(onSubmit)}
          className="flex-col justify-center items-center mb-8 glass p-4 flex w-1/3"
        >
          <input
            type="text"
            placeholder="Enter research topic"
            className="bg-gray-800 border border-gray-600 px-4 py-2 w-[95%] rounded-full text-white"
            style={{ transform: 'translateZ(30px)' }}
            {...register('topic', { required: true })}
          />
          {errors.topic && <p style={{ transform: 'translateZ(20px)' }} className="text-red-400 mb-2">Topic is required</p>}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600  ml-5 text-white rounded-full hover:bg-blue-700"
            disabled={loading}
            style={{ transform: 'translateZ(40px)' }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <p style={{ transform: 'translateZ(20px)' }} className="text-red-400 mt-2">{error}</p>}
        </motion.form>
      </div>
      {limitError && (
        <div className='p-2 mb-8 w-full flex justify-center'>
          <ErrorPage />
        </div>
      )}
    </>
  );
}

export default SubmitForm;
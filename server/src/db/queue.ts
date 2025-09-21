import { Queue } from 'bullmq';

const researchQueue = new Queue('research', {
  connection: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  defaultJobOptions: { attempts: 3, backoff: { type: 'fixed', delay: 5000 } }
});

export default researchQueue;
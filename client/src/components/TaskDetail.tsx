import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagnifyingDiv from './MagnifyingDiv';

type TaskDetailType = {
  task: {
    id: number;
    topic: string;
    status: string;
    created_at: string;
  };
  logs: Array<{
    step: string;
    message: string;
    timestamp: string;
  }>;
  results: {
    report: string;
    articles: Array<{
      title: string;
      summary: string;
      keywords: string[];
    }>;
  };
};

function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<TaskDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLimitError, setShowLimitError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`https://localhost:3000/research/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === 'Free tier limit exceeded') {
            setShowLimitError(true);
          }
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setDetail(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

    if (detail?.task.status !== 'completed' && detail?.task.status !== 'failed' && !showLimitError) {
      const interval = setInterval(fetchDetail, 3000);
      return () => clearInterval(interval);
    }
  }, [id, detail, showLimitError]);

  if (loading) return <p className="text-gray-400">Loading details...</p>;
  if (!detail) return <p className="text-red-400">No details found</p>;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass p-4"
      >
        <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h2 className="text-2xl font-bold mb-2">{detail.task.topic}</h2>
        <p className="mb-1">Status: {detail.task.status}</p>
        <p className="mb-4">Created: {detail.task.created_at}</p>
        <h3 className="text-xl font-bold mb-2">Logs</h3>
        <ul className="space-y-1 mb-4">
          {detail.logs.map((log, index) => (
            <li key={index} className="text-gray-300">
              {log.step}: {log.message} ({log.timestamp})
            </li>
          ))}
        </ul>
        {detail.results && (
          <>

            <MagnifyingDiv className="mb-4 bg-gray-800 p-3 rounded">
              <h3 className="text-xl font-bold mb-2">Report</h3>
              <div className="prose prose-invert mb-4">
                <ReactMarkdown>{detail.results.report}</ReactMarkdown>
              </div>
            </MagnifyingDiv>

            <h3 className="text-xl font-bold mb-2">Articles</h3>
            {detail.results.articles.map((article, index) => (

              <MagnifyingDiv key={index} className="mb-4 bg-gray-800 p-3 rounded">
                <h4 className="font-bold text-lg">{article.title}</h4>
                <p className="text-gray-300">{article.summary}</p>
                <p className="text-gray-400">Keywords: {article.keywords.join(', ')}</p>
              </MagnifyingDiv>

            ))}
          </>
        )}
      </motion.div>
    </>
  );
}

export default TaskDetail;
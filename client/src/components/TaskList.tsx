import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type Task = {
  id: number
  topic: string
  status: string
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://localhost:3000/research')
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const data = await response.json()
        setTasks(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  if (loading) return <p className="text-gray-400">Loading tasks...</p>

  return (
    <div className="glass p-4 mb-8">
      <h2 className="text-2xl font-bold mb-2">Previous Research Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <motion.li 
            key={task.id} 
            className="bg-gray-800 p-2 rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/tasks/${task.id}`} className="text-blue-400 hover:text-blue-300">
              {task.topic} - Status: {task.status}
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
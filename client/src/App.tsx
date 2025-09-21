import { Routes, Route } from 'react-router-dom'
import SubmitForm from './components/SubmitForm'
import TaskList from './components/TaskList'
import TaskDetail from './components/TaskDetail'
import Title from './components/Title'

function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <Title />
      <Routes>
        <Route path="/" element={<><SubmitForm /><TaskList /></>} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
      </Routes>
    </div>
  )
}

export default App
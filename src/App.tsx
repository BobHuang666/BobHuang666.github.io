import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo-desc" element={<ProjectDetail />} />
        <Route path="/demo" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <h1 className="text-2xl">演示页面开发中...</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
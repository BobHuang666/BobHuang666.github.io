import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectDetail';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
// import BlogDetailPage from './pages/BlogDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/demo-desc" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            {/* <Route path="/blog/:id" element={<BlogDetailPage />} /> */}
            <Route path="/demo" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <h1 className="text-2xl">演示页面开发中...</h1>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
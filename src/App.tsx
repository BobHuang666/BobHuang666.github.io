import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Code2 } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const projects = [
    {
      title: "Project Management System",
      description: "A full-stack application for managing projects and tasks, built with React and Node.js",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1000",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      link: "#"
    },
    {
      title: "E-commerce Platform",
      description: "Modern e-commerce solution with real-time inventory management",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000",
      tags: ["React", "TypeScript", "Stripe", "Firebase"],
      link: "#"
    },
    {
      title: "AI Chat Application",
      description: "Real-time chat application with AI-powered responses",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
      tags: ["Python", "TensorFlow", "WebSocket", "React"],
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Code2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Portfolio</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a>
              <a href="#projects" className="text-gray-600 hover:text-indigo-600 transition-colors">Projects</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">About</a>
              <a href="#projects" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Projects</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Full Stack Developer
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Building beautiful, responsive, and user-friendly web applications
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#projects" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              View Projects
            </a>
            <a href="#contact" className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                  >
                    View Project <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            I'm always open to new opportunities and interesting projects.
            Feel free to reach out if you'd like to collaborate!
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Github className="h-8 w-8" />
            </a>
            <a href="https://linkedin.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Linkedin className="h-8 w-8" />
            </a>
            <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Mail className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
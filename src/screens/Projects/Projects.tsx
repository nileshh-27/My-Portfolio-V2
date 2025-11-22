import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Github, ExternalLink, Filter, Calendar, Users, Award } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Hospital Management System',
    description: 'Developed a fully functional Hospital Management System (HMS) with secure multi-role access for administrators, doctors, and patients. Features three-tier user access system and responsive UI design.',
    image: 'HMS Project',
    technologies: ['Java', 'JSP', 'Servlets', 'MongoDB', 'MySQL', 'Bootstrap 5'],
    category: 'Full Stack',
    period: 'Jan 2025 – May 2025',
    highlights: [
      'Implemented secure, role-based data access',
      'Responsive UI with Bootstrap 5',
      'Optimized data retrieval by 25%',
      'Efficient MongoDB indexing'
    ],
    github: 'https://github.com/nileshh-27/Hospital-Management-System',
    live: '#'
  },
  {
    id: 2,
    title: 'FemWell - AI-Powered Women\'s Health Analysis',
    description: 'Developed an AI-powered web application for PCOS detection, combining medical image analysis with user survey data. Built for Forge Inspira Hackathon.',
    image: '.public/Femwell_frntpic',
    technologies: ['Python', 'TensorFlow', 'Keras', 'Flask', 'HTML', 'CSS', 'JavaScript', 'MongoDB'],
    category: 'AI/ML',
    period: 'March 2025',
    highlights: [
      'AI-based ultrasound image classification',
      'TensorFlow and Keras implementation',
      'Responsive Flask web application',
      'Structured MongoDB database'
    ],
    github: 'https://github.com/nileshh-27/FemWell--PCOS-Detection-using-CNN-',
    live: '#'
  },
  {
    id: 3,
    title: 'Diabetes Prediction System',
    description: 'Developed an ML-powered web application for diabetes risk prediction with real-time visualization. Capstone project during Edunet Foundation & Microsoft Azure Internship.',
    image: 'Diabetes ML',
    technologies: ['Python', 'Flask', 'React', 'Random Forest', 'Matplotlib', 'Seaborn'],
    category: 'AI/ML',
    period: 'May 2025 – June 2025',
    highlights: [
      'Advanced feature engineering (WoE encoding)',
      'React-based interactive frontend',
      'Real-time predictions via Flask API',
      'Accuracy and ROC-AUC evaluation'
    ],
    github: 'https://github.com/nileshh-27/Diabetic-Detection-using-ML',
    live: '#'
  },
  {
    id: 4,
    title: 'Space Station Safety Detection',
    description: 'Developed a high-performance object detection model to identify critical safety equipment in synthetic space station environment, achieving a final score of 80.17.',
    image: 'Space Safety',
    technologies: ['Python', 'PyTorch', 'Ultralytics YOLOv8', 'OpenCV', 'Google Colab', 'Gradio'],
    category: 'AI/ML',
    period: 'Hackathon Project',
    highlights: [
      'YOLOv8m model architecture',
      'Advanced data augmentations',
      'Cloud-based training workflow',
      'Automated checkpointing strategy'
    ],
    github: 'https://github.com/nileshh-27/Safety-Object-Detection-Duality-AI',
    live: '#'
  }
];

const categories = ['All', 'Full Stack', 'AI/ML', 'Web Development'];

export const Projects = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-['Fira_Code']">
            My Projects
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            A showcase of my technical projects spanning full-stack development, artificial intelligence, 
            and machine learning. Each project represents a unique challenge and learning experience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {projects.length}
              </div>
              <div className="text-gray">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                3
              </div>
              <div className="text-gray">AI/ML Projects</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                10+
              </div>
              <div className="text-gray">Technologies</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                2
              </div>
              <div className="text-gray">Hackathons</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-gray mb-4">
            <Filter size={20} />
            <span className="font-['Fira_Code']">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-['Fira_Code'] text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-app-primary text-white'
                    : 'backdrop-blur-md bg-white/10 text-gray hover:bg-white/20 hover:text-white border border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-to-br from-app-primary/10 to-purple-500/10 rounded-t-lg flex items-center justify-center text-gray-400 relative overflow-hidden border-b border-white/10">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-app-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-app-primary font-bold text-lg">{project.id}</span>
                    </div>
                    <span className="text-sm">{project.image}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={project.github}
                      className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Github className="text-white" size={20} />
                    </a>
                    <a
                      href={project.live}
                      className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="text-white" size={20} />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white font-['Fira_Code'] mb-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {project.period}
                        </div>
                        <span className="px-2 py-1 bg-app-primary/20 text-app-primary rounded text-xs">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2 text-sm">Key Highlights:</h4>
                    <ul className="space-y-1">
                      {project.highlights.map((highlight, index) => (
                        <li key={index} className="text-gray text-xs flex items-start gap-2">
                          <div className="w-1 h-1 bg-app-primary rounded-full mt-2"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/10 text-gray rounded text-xs border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      className="flex items-center gap-2 text-app-primary hover:text-purple-400 transition-colors text-sm"
                    >
                      <Github size={16} /> Code
                    </a>
                    <a
                      href={project.live}
                      className="flex items-center gap-2 text-app-primary hover:text-purple-400 transition-colors text-sm"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray text-lg">No projects found in this category.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4 font-['Fira_Code']">
                Interested in Collaboration?
              </h2>
              <p className="text-gray mb-6">
                I'm always open to discussing new projects, innovative ideas, or opportunities to contribute 
                to meaningful solutions. Let's connect and create something amazing together!
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-app-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-app-primary/25 transition-all duration-300"
              >
                Get In Touch
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
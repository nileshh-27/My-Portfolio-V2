import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Github, ExternalLink, Clock, Brain, Database, Code as Code2, Zap } from 'lucide-react';

const miniProjects = [
  {
    id: 1,
    title: 'PLAGEARLY - Plagiarism Detection Platform',
    description: 'A robust and user-friendly web platform to detect plagiarism, generate detailed similarity reports, and flag paraphrased content. Empowers students, educators, and researchers to maintain academic integrity.',
    technologies: ['Python', 'HTML', 'CSS', 'JavaScript', 'NLTK', 'Scikit-Learn'],
    category: 'NLP/AI',
    icon: Brain,
    features: [
      'NLP-Based Text Analysis',
      'Detailed Similarity Reports',
      'Paraphrase Detection',
      'User Data Storage'
    ],
    github: 'https://github.com/nileshh-27/Plagarism-checker',
    live: '#',
    buildTime: '2 weeks'
  },
  {
    id: 2,
    title: 'Social Media Sentiment Analysis',
    description: 'Real-time social media sentiment analysis using streaming data pipelines. Leverages Apache Spark Streaming to collect, process, and classify sentiment as positive, negative, or neutral.',
    technologies: ['Python', 'Apache Spark', 'MongoDB', 'Streaming Data', 'NLP'],
    category: 'Data Engineering',
    icon: Zap,
    features: [
      'Real-time Data Processing',
      'Apache Spark Streaming',
      'Sentiment Classification',
      'MongoDB Integration'
    ],
    github: 'https://github.com/nileshh-27/Social-media-sentimental-analysis-using-streaming-data-pipelines',
    live: '#',
    buildTime: '3 weeks'
  },
  {
    id: 3,
    title: 'Fashion-MNIST CNN Comparison',
    description: 'Comprehensive comparison of VGG16, ResNet50, and AlexNet performance on Fashion-MNIST dataset. Conducted transfer learning experiments with 2000 training/testing images in Google Colab.',
    technologies: ['Python', 'TensorFlow', 'Keras', 'VGG16', 'ResNet50', 'AlexNet'],
    category: 'Deep Learning',
    icon: Code2,
    features: [
      'Transfer Learning Implementation',
      'Model Performance Comparison',
      'Fashion-MNIST Classification',
      'Google Colab Integration'
    ],
    github: 'https://github.com/nileshh-27/Comparison-of-AlexNet-VGG-and-ResNet-on-Fashion-Dataset-MNIST',
    live: '#',
    buildTime: '1 week'
  },
  {
    id: 4,
    title: 'E-Commerce Utility Tool',
    description: 'A Java Swift UI based e-commerce utility tool designed to streamline online shopping processes and enhance user experience with modern interface design.',
    technologies: ['Java', 'Swift UI', 'Mobile Development'],
    category: 'Mobile App',
    icon: Database,
    features: [
      'Swift UI Interface',
      'Java Backend',
      'E-commerce Functionality',
      'Modern Design'
    ],
    github: '#',
    live: '#',
    buildTime: '2 weeks'
  }
];

const categories = ['All', 'NLP/AI', 'Data Engineering', 'Deep Learning', 'Mobile App'];

export const MiniProjects = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? miniProjects 
    : miniProjects.filter(project => project.category === selectedCategory);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-['Fira_Code']">
            Mini Projects
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            A collection of focused projects exploring different aspects of software development, 
            from NLP and machine learning to web platforms and mobile applications. Each project 
            demonstrates specific technical skills and problem-solving approaches.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {miniProjects.length}
              </div>
              <div className="text-gray">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                4
              </div>
              <div className="text-gray">Categories</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                15+
              </div>
              <div className="text-gray">Technologies</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                8+
              </div>
              <div className="text-gray">Weeks Development</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-gray mb-4">
            <Code2 size={20} />
            <span className="font-['Fira_Code']">Filter by category:</span>
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
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <Card key={project.id} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-app-primary/20 rounded-lg">
                        <IconComponent className="text-app-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-['Fira_Code'] leading-tight">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-app-primary/20 text-app-primary rounded text-xs">
                            {project.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray">
                            <Clock size={12} />
                            {project.buildTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2 text-sm">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {project.features.map((feature, index) => (
                        <div key={index} className="text-gray text-xs flex items-start gap-2">
                          <div className="w-1 h-1 bg-app-primary rounded-full mt-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-app-primary hover:text-purple-400 transition-colors text-sm"
                    >
                      <Github size={14} /> Code
                    </a>
                    {project.live !== '#' && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-app-primary hover:text-purple-400 transition-colors text-sm"
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                Explore More Projects
              </h2>
              <p className="text-gray mb-6">
                These mini projects represent my journey in exploring different technologies and solving 
                various problems. Each project taught me something new and helped me grow as a developer.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-app-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-app-primary/25 transition-all duration-300"
                >
                  View Major Projects
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 backdrop-blur-md bg-white/10 text-white px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Get In Touch
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
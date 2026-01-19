import React from 'react';
import Snowfall from 'react-snowfall';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export const Home = (): JSX.Element => {
  return (
    <>
    <Snowfall color="white" />
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white font-['Fira_Code']">
                  Hi, I'm{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-primary to-purple-400">
                    Nilesh Reddy 
                  </span>
                </h1>
                <p className="text-xl text-gray font-['Fira_Code']">
                  Student & AI/ML Enthusiast
                </p>
                <p className="text-lg text-gray/80 max-w-lg leading-relaxed">
                   <p>Computer Science Engineering student at KL University with interests in data engineering, web development, artificial intelligence/machine learning.</p>
  <p>Passionate about creating innovative solutions that make a difference.</p>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-app-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-app-primary/25 transition-all duration-300"
                >
                  View My Work <ArrowRight size={20} />
                </Link>
                <a
                    href="https://drive.google.com/file/d/1EQ2TnV-0BYMEa0vgRFTqKtVoOUwGQLea/view?usp=sharing"
                    download="Nilesh_Reddy_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-app-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-app-primary/25 transition-all duration-300"
                  >
                    <Download size={20} /> Download Resume
                  </a>
              </div>
              
              <div className="flex gap-4">
                <a href="https://github.com/nileshh-27" className="p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Github className="text-white" size={24} />
                </a>
                <a href="https://linkedin.com/in/nileshreddyk" className="p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Linkedin className="text-white" size={24} />
                </a>
                <a href="mailto:karrinileshreddy@gmail.com" className="p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Mail className="text-white" size={24} />
                </a>
                <a href="tel:+919550117500" className="p-3 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Phone className="text-white" size={24} />
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-app-primary/20 to-purple-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full backdrop-blur-md bg-white/10 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/image.png" 
                    alt="Nilesh Reddy K" 
                    className="w-64 h-64 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                  <div className="w-64 h-64 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hidden">
                    Profile Image
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">
            Technologies I Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Java', 'Python', 'React.js', 'Node.js', 'MongoDB', 'MySQL','AWS', 'SpringBoot', 'NumPY', 'pandas', 'Photoshop', 'Canva' ].map((tech) => (
              <Card key={tech} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-app-primary/20 to-purple-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center text-xs border border-white/20">
                    <span className="text-app-primary font-bold">{tech.slice(0, 2)}</span>
                  </div>
                  <p className="text-white font-['Fira_Code'] text-sm">{tech}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white font-['Fira_Code']">
              Featured Projects
            </h2>
            <Link
              to="/projects"
              className="text-app-primary hover:text-purple-400 font-['Fira_Code'] flex items-center gap-2"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Hospital Management System",
                description: "Fully functional HMS with secure multi-role access for administrators, doctors, and patients.",
                tech: ["Java", "JSP", "MongoDB", "Bootstrap"]
              },
              {
                title: "FemWell - AI Health Analysis",
                description: "AI-powered web application for PCOS detection using medical image analysis.",
                tech: ["Python", "TensorFlow", "Flask", "MongoDB"]
              },
              {
                title: "Diabetes Prediction System",
                description: "ML-powered web application for diabetes risk prediction with real-time visualization.",
                tech: ["Python", "Flask", "React", "ML"]
              }
            ].map((project, i) => (
              <Card key={i} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-app-primary/10 to-purple-500/10 rounded-t-lg flex items-center justify-center text-gray-400 border-b border-white/10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-app-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-app-primary font-bold text-xl">{i + 1}</span>
                      </div>
                      <span className="text-sm">Project Screenshot</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 font-['Fira_Code']">
                      {project.title}
                    </h3>
                    <p className="text-gray mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-app-primary/20 text-app-primary rounded text-xs">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <a href="#" className="text-app-primary hover:text-purple-400 transition-colors">
                        <Github size={20} />
                      </a>
                      <a href="#" className="text-app-primary hover:text-purple-400 transition-colors">
                        <ArrowRight size={20} />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">9.41</div>
                <div className="text-gray text-sm">CGPA</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">500+</div>
                <div className="text-gray text-sm">Problems Solved</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">1459</div>
                <div className="text-gray text-sm">Peak CodeChef Rating</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">5+</div>
                <div className="text-gray text-sm">Certifications</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  </>
  );
};
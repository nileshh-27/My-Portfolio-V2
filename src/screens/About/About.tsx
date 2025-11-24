import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Code, Palette, Server, Brain, Award, MapPin, Calendar, GraduationCap } from 'lucide-react';

const skills = [
  {
    category: 'Languages',
    icon: Code,
    technologies: ['Java', 'Python', 'JavaScript', 'HTML', 'CSS', 'SQL']
  },
  {
    category: 'Frameworks',
    icon: Server,
    technologies: ['React.js', 'Node.js', 'Flask', 'REST API', 'Bootstrap']
  },
  {
    category: 'AI/ML',
    icon: Brain,
    technologies: ['TensorFlow', 'Keras', 'Machine Learning', 'Data Analysis', 'Computer Vision']
  },
  {
    category: 'Tools & Design',
    icon: Palette,
    technologies: ['Git', 'GitHub', 'Figma', 'Adobe Photoshop', 'Premiere Pro', 'Canva']
  }
];

const education = [
  {
    degree: 'Bachelor of Technology',
    field: 'Computer Science and Engineering',
    institution: 'KL University, Hyderabad',
    period: '2023 - Present',
    grade: 'CGPA: 9.31'
  },
  {
    degree: 'Intermediate Education',
    field: 'Telangana Board',
    institution: 'Narayana Junior College',
    period: '2021 - 2023',
    grade: ''
  },
  {
    degree: '10th Grade',
    field: 'Telangana Board of Secondary Education',
    institution: 'Sri Sai Public School',
    period: '2011 - 2021',
    grade: ''
  }
];

const certifications = [
  'Automation Anywhere Advanced RPA Professional (Sept 2024)',
  'Cambridge University Lingua Skills Certification – B2 Level (174 CFR) (Dec 2024)',
  'Oracle Cloud Infrastructure Associate Architect (September 2025)',
  'Oracle Gen AI Professional (September 2025)',
  'MongoDB Certified Developer Associate - C100 DEV (November 2025)'
];

const achievements = [
  'Felicitated as an exemplary student organizer for the ChatterBot event during Avinya Tech Fest',
  'Solved 500+ problems across various coding platforms',
  'Peak CodeChef rating of 1459',
  'Copy Editor at KERNEL – The CSE Chronicles',
  'Event Coordinator for Chatter Bot 2024 @ Avinya Tech Fest'
];

export const About = (): JSX.Element => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-['Fira_Code']">
            About Me
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            I'm a passionate Computer Science Engineering student at KL University with a strong foundation 
            in full-stack development, artificial intelligence, and machine learning. I love solving complex 
            problems and building innovative solutions.
          </p>
        </div>

        {/* Bio Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4 font-['Fira_Code']">
                  My Journey
                </h2>
                <div className="space-y-4 text-gray leading-relaxed">
                  <p>
                    Currently pursuing my Bachelor's in Computer Science Engineering at KL University, 
                    Hyderabad, with an impressive CGPA of 9.31. My journey in technology started with 
                    curiosity about how things work and evolved into a passion for creating solutions.
                  </p>
                  <p>
                    I specialize in full-stack web development and have a keen interest in artificial 
                    intelligence and machine learning. My projects range from healthcare management 
                    systems to AI-powered diagnostic tools, always focusing on real-world impact.
                  </p>
                  <p>
                    Beyond coding, I'm actively involved in organizing tech events, contributing to 
                    publications, and continuously learning new technologies. I believe in the power 
                    of technology to solve meaningful problems.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4 font-['Fira_Code']">
                  Quick Facts
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-app-primary" size={16} />
                    <span className="text-gray">Location:</span>
                    <span className="text-white">Hyderabad, India</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="text-app-primary" size={16} />
                    <span className="text-gray">University:</span>
                    <span className="text-white">KL University</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="text-app-primary" size={16} />
                    <span className="text-gray">CGPA:</span>
                    <span className="text-app-primary font-bold">9.31</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-app-primary" size={16} />
                    <span className="text-gray">Status:</span>
                    <span className="text-app-primary">Open to opportunities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4 font-['Fira_Code']">
                  Coding Profiles
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray">LeetCode:</span>
                    <span className="text-white">nilesh_20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">CodeForces:</span>
                    <span className="text-white">nileshreddyk</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">CodeChef:</span>
                    <span className="text-white">nileshhh_21</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">MentorPick:</span>
                    <span className="text-white">nileshreddyk</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <Card key={skill.category} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className="text-app-primary" size={24} />
                      <h3 className="text-white font-bold font-['Fira_Code']">
                        {skill.category}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {skill.technologies.map((tech) => (
                        <div key={tech} className="text-gray text-sm">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="backdrop-blur-md bg-white/5 border border-white/10">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-['Fira_Code']">
                        {edu.degree}
                      </h3>
                      <p className="text-app-primary">{edu.field}</p>
                      <p className="text-gray">{edu.institution}</p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <span className="text-gray text-sm">{edu.period}</span>
                      {edu.grade && (
                        <div className="text-app-primary font-bold">{edu.grade}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">
            Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="backdrop-blur-md bg-white/5 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Award className="text-app-primary mt-1" size={20} />
                    <p className="text-gray leading-relaxed">{cert}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">
            Achievements & Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="backdrop-blur-md bg-white/5 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-app-primary rounded-full mt-2"></div>
                    <p className="text-gray leading-relaxed">{achievement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
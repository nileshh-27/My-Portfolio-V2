import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Mail, Phone, MapPin, Github, Linkedin, Send, Code, Trophy, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Snowfall from 'react-snowfall';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'karrinileshreddy@gmail.com',
    href: 'mailto:karrinileshreddy@gmail.com'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91-9550117500',
    href: 'tel:+919550117500'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Hyderabad, India',
    href: '#'
  }
];

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/nileshh-27',
    username: '@nileshh-27'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/nileshreddyk',
    username: 'Nilesh Reddy K'
  }
];

const codingProfiles = [
  {
    platform: 'LeetCode',
    username: 'nilesh_20',
    href: 'https://leetcode.com/nilesh_20/'
  },
  {
    platform: 'CodeForces',
    username: 'nileshreddyk',
    href: 'https://codeforces.com/profile/nileshreddyk'
  },
  {
    platform: 'CodeChef',
    username: 'nileshhh_21',
    href: 'https://www.codechef.com/users/nileshhh_21'
  },
  {
    platform: 'MentorPick',
    username: 'nileshreddyk',
    href: 'https://mentorpick.com/profile/2310030017-karri_nilesh_r'
  }
];

export const Contact = (): JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailjs.send(
    'service_2rfryy8',
    'template_fbaxfb9',
    formData,
    '2hPO1UaV4MYRBJxrI'
  )
  .then(() => {
    alert('Message sent!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  })
  .catch(() => {
    alert('Failed to send message.');
  });
  };

  return (
    <>
    <Snowfall color="white" />
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-['Fira_Code']">
            Get In Touch
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            I'm always excited to discuss new opportunities, collaborate on interesting projects, 
            or simply connect with fellow developers and tech enthusiasts. Let's create something amazing together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Fira_Code']">
                  Send Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-gray text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-app-primary focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell me about your project, collaboration idea, or just say hello..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-app-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-app-primary/25 transition-all duration-300"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Fira_Code']">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info) => {
                    const IconComponent = info.icon;
                    return (
                      <a
                        key={info.label}
                        href={info.href}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="p-2 bg-app-primary/20 rounded-lg group-hover:bg-app-primary/30 transition-colors">
                          <IconComponent className="text-app-primary" size={20} />
                        </div>
                        <div>
                          <div className="text-gray text-sm">{info.label}</div>
                          <div className="text-white font-medium">{info.value}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Fira_Code']">
                  Connect With Me
                </h2>
                <div className="space-y-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="p-2 bg-app-primary/20 rounded-lg group-hover:bg-app-primary/30 transition-colors">
                          <IconComponent className="text-app-primary" size={20} />
                        </div>
                        <div>
                          <div className="text-white font-medium">{social.label}</div>
                          <div className="text-gray text-sm">{social.username}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Coding Profiles */}
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Fira_Code'] flex items-center gap-2">
                  <Code size={24} />
                  Coding Profiles
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {codingProfiles.map((profile) => (
                    <a
                      key={profile.platform}
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg hover:bg-white/10 transition-all duration-300 group text-center"
                    >
                      <div className="text-white font-medium text-sm">{profile.platform}</div>
                      <div className="text-gray text-xs">{profile.username}</div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-app-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 text-app-primary text-sm">
                    <Trophy size={16} />
                    <span>400+ Problems Solved | Peak CodeChef Rating: 1399</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4 font-['Fira_Code']">
                  Current Status
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white">Available for opportunities</span>
                  </div>
                  <div className="text-gray text-sm">
                    🎓 Pre-Final year CSE student at KL University
                  </div>
                  <div className="text-gray text-sm">
                    📍 Based in Hyderabad, India
                  </div>
                  <div className="text-gray text-sm">
                    ⚡ Response time: Usually within 24 hours
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-white font-bold mb-2">Are you available for internships?</h3>
                <p className="text-gray text-sm">
                  Yes! I'm actively seeking internship opportunities in full-stack development, 
                  AI/ML, or software engineering roles.
                </p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-white font-bold mb-2">Do you work on freelance projects?</h3>
                <p className="text-gray text-sm">
                  Absolutely! I'm open to freelance web development and AI/ML projects. 
                  Let's discuss your requirements and timeline.
                </p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-white font-bold mb-2">What's your preferred tech stack?</h3>
                <p className="text-gray text-sm">
                  I love working with React, Node.js, Python, and MongoDB. I'm also experienced 
                  with Java, Flask, and various AI/ML frameworks.
                </p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-md bg-white/5 border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-white font-bold mb-2">Can you mentor junior developers?</h3>
                <p className="text-gray text-sm">
                  I'd be happy to share my knowledge! Feel free to reach out if you need 
                  guidance with coding problems or career advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};
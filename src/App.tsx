import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './screens/Home';
import { About } from './screens/About';
import { Projects } from './screens/Projects';
import { MiniProjects } from './screens/MiniProjects';
import { Contact } from './screens/Contact';
import { Status } from './screens/Status'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-app-background via-slate-900 to-app-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/status" element={<Status />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/mini-projects" element={<MiniProjects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
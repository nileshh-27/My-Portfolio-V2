// src/screens/Projects/Projects.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Github, ExternalLink, Filter, Calendar } from 'lucide-react';

const SUPABASE_URL = 'https://nyeidqiinmfhsjduitjq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZWlkcWlpbm1maHNqZHVpdGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDEwNDUsImV4cCI6MjA3OTM3NzA0NX0.Ggb6bPko3iRhGYIBjB25FOVyAPlTxmV4xzufWTRsXIM';

type ProjectRow = {
  id: string;
  title: string;
  description?: string;
  image?: string | null;
  technologies?: string[] | any;
  category?: string;
  period?: string;
  highlights?: string[] | any;
  github?: string | null;
  live?: string | null;
};

async function fetchProjectsFromSupabase(): Promise<ProjectRow[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.asc`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.error('Supabase projects fetch failed', res.status, await res.text());
      return [];
    }
    const arr = await res.json();
    // Normalize JSON columns (postgres sometimes returns as parsed objects already)
    return (Array.isArray(arr) ? arr : []).map((r: any) => ({
      ...r,
      technologies: typeof r.technologies === 'string' ? JSON.parse(r.technologies) : r.technologies || [],
      highlights: typeof r.highlights === 'string' ? JSON.parse(r.highlights) : r.highlights || [],
    }));
  } catch (e) {
    console.error('fetchProjectsFromSupabase error', e);
    return [];
  }
}

export const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const rows = await fetchProjectsFromSupabase();
      setProjects(rows);
      setLoading(false);
    }
    load();
  }, []);

  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => cats.add(p.category || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => (p.category ?? 'Uncategorized') === selectedCategory);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-transparent border-t-violet-400 rounded-full animate-spin mx-auto" />
          <div className="mt-3 text-gray-300">Loading projects…</div>
        </div>
      </div>
    );
  }

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
                {projects.filter(p => (p.category ?? '').toLowerCase().includes('ai')).length}
              </div>
              <div className="text-gray">AI/ML Projects</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {Array.from(new Set(projects.flatMap(p => (p.technologies || [])))).length || '10+'}
              </div>
              <div className="text-gray">Technologies</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {projects.filter(p => (p.period || '').toLowerCase().includes('hackathon')).length || 2}
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
                className={`px-4 py-2 rounded-lg font-['Fira_Code'] text-sm transition-all duration-300 ${selectedCategory === category
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
                      <span className="text-app-primary font-bold text-lg">{project.title?.[0] ?? '?'}</span>
                    </div>
                    <span className="text-sm">{project.image || ''}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Github className="text-white" size={20} />
                      </a>
                    )}
                    {project.live && project.live !== '#' && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <ExternalLink className="text-white" size={20} />
                      </a>
                    )}
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
                      {(project.highlights || []).map((highlight: string, index: number) => (
                        <li key={index} className="text-gray text-xs flex items-start gap-2">
                          <div className="w-1 h-1 bg-app-primary rounded-full mt-2"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(project.technologies || []).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/10 text-gray rounded text-xs border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-app-primary hover:text-purple-400 transition-colors text-sm"
                      >
                        <Github size={16} /> Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-app-primary hover:text-purple-400 transition-colors text-sm"
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
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

        {/* CTA */}
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

export default Projects;

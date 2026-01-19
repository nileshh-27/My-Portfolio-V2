// src/screens/MiniProjects/MiniProjects.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Github, ExternalLink, Clock } from 'lucide-react';
import { Brain, Zap, Code as Code2, Database } from 'lucide-react';
import Snowfall from 'react-snowfall';

const SUPABASE_URL = "https://nyeidqiinmfhsjduitjq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZWlkcWlpbm1maHNqZHVpdGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDEwNDUsImV4cCI6MjA3OTM3NzA0NX0.Ggb6bPko3iRhGYIBjB25FOVyAPlTxmV4xzufWTRsXIM";

type MiniProjectRow = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  icon: string;
  features: string[];
  github: string;
  live: string;
  build_time: string;
};

const iconMap: Record<string, any> = {
  Brain,
  Zap,
  Code2,
  Database,
};

async function fetchMiniProjects(): Promise<MiniProjectRow[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/mini_projects?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) return [];

    const arr = await res.json();

    return arr.map((p: any) => ({
      ...p,
      technologies:
        typeof p.technologies === "string"
          ? JSON.parse(p.technologies)
          : p.technologies,
      features:
        typeof p.features === "string" ? JSON.parse(p.features) : p.features,
    }));
  } catch (e) {
    console.error("Mini Projects fetch error:", e);
    return [];
  }
}

export const MiniProjects = (): JSX.Element => {
  const [projects, setProjects] = useState<MiniProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const rows = await fetchMiniProjects();
      setProjects(rows);
      setLoading(false);
    }
    load();
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set(["All"]);
    projects.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const filtered = selectedCategory === "All"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-10 h-10 border-4 border-t-violet-500 border-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-3">Loading mini projects…</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Snowfall color="white" />
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-['Fira_Code']">
            Mini Projects
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            A collection of focused micro-projects showcasing specialized skills in AI, Data Engineering, Web Tools and more.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {projects.length}
              </div>
              <div className="text-gray">Total Projects</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {categories.length - 1}
              </div>
              <div className="text-gray">Categories</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {Array.from(
                  new Set(projects.flatMap((p) => p.technologies))
                ).length}
              </div>
              <div className="text-gray">Technologies</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-app-primary mb-2 font-['Fira_Code']">
                {projects.length * 2}+
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
                    ? "bg-app-primary text-white"
                    : "backdrop-blur-md bg-white/10 text-gray hover:bg-white/20 hover:text-white border border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((project) => {
            const IconComponent = iconMap[project.icon] || Code2;

            return (
              <Card
                key={project.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <CardContent className="p-6">

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-app-primary/20 rounded-lg">
                      <IconComponent className="text-app-primary" size={24} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white font-['Fira_Code']">
                        {project.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-app-primary/20 text-app-primary rounded text-xs">
                          {project.category}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-gray">
                          <Clock size={12} />
                          {project.build_time}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-white mb-2 text-sm">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {project.features.map((f, i) => (
                        <div
                          key={i}
                          className="text-gray text-xs flex items-start gap-2"
                        >
                          <div className="w-1 h-1 bg-app-primary rounded-full mt-[6px]"></div>
                          {f}
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
                    {project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-app-primary hover:text-purple-400 transition-colors text-sm"
                      >
                        <Github size={14} /> Code
                      </a>
                    )}

                    {project.live !== "#" && (
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

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray text-lg">
              No mini projects found for this category.
            </p>
          </div>
        )}

      </div>
    </div>
    </>
  );
};

export default MiniProjects;

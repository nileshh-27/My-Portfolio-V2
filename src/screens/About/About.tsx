// src/screens/About/about.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Code,
  Palette,
  Server,
  Brain,
  Award,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";

/**
 * Supabase REST config (same as other pages)
 * Update these if your project values differ.
 */
const SUPABASE_URL = "https://nyeidqiinmfhsjduitjq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZWlkcWlpbm1maHNqZHVpdGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDEwNDUsImV4cCI6MjA3OTM3NzA0NX0.Ggb6bPko3iRhGYIBjB25FOVyAPlTxmV4xzufWTRsXIM";

/** helper to fetch the about row */
async function fetchAboutRow() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/about?select=*&limit=1`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.error("Supabase about fetch failed", res.status, await res.text());
      return null;
    }
    const arr = await res.json();
    return Array.isArray(arr) && arr.length ? arr[0] : null;
  } catch (e) {
    console.error("fetchAboutRow error", e);
    return null;
  }
}

export const About = (): JSX.Element => {
  const [row, setRow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const r = await fetchAboutRow();
      setRow(r);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-10 h-10 border-4 border-transparent border-t-violet-400 rounded-full animate-spin mx-auto" />
          <div className="mt-3 text-gray-300">Loading profile…</div>
        </div>
      </div>
    );
  }

  // fallback defaults if DB returns null
  const data = row ?? {};
  const fullName = data.full_name ?? "Your Name";
  const shortBio =
    data.short_bio ??
    "I'm a passionate Computer Science Engineering student with a strong foundation in full-stack development and AI.";
  const location = data.location ?? "Hyderabad, India";
  const university = data.university ?? "KL University";
  const cgpa = data.cgpa ?? "N/A";
  const status = data.status ?? "Open to opportunities";

  // JSON columns (already stored as jsonb). Ensure we parse but if row already has object, use it.
  const codingProfiles = (typeof data.coding_profiles === "string")
    ? JSON.parse(data.coding_profiles)
    : data.coding_profiles || {};
  const skills = (typeof data.skills === "string")
    ? JSON.parse(data.skills)
    : data.skills || [];
  const education = (typeof data.education === "string")
    ? JSON.parse(data.education)
    : data.education || [];
  const certifications = (typeof data.certifications === "string")
    ? JSON.parse(data.certifications)
    : data.certifications || [];
  const achievements = (typeof data.achievements === "string")
    ? JSON.parse(data.achievements)
    : data.achievements || [];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-['Fira_Code']">
            About Me
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
            {shortBio}
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
                    Currently pursuing Bachelor's in Computer Science and Engineering at{" "}
                    <span className="text-app-primary">{university}</span>, with a CGPA of{" "}
                    <span className="text-app-primary font-bold">{cgpa}</span>.
                  </p>
                  <p>
                    I specialize in full-stack web development and have a keen interest in artificial intelligence and machine learning. My projects range from healthcare management systems to AI-powered diagnostic tools — focusing on real-world impact.
                  </p>
                  <p>
                    Beyond coding, I'm actively involved in organizing tech events, contributing to publications, and continuously learning new technologies.
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
                    <span className="text-white">{location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="text-app-primary" size={16} />
                    <span className="text-gray">University:</span>
                    <span className="text-white">{university}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="text-app-primary" size={16} />
                    <span className="text-gray">CGPA:</span>
                    <span className="text-app-primary font-bold">{cgpa}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-app-primary" size={16} />
                    <span className="text-gray">Status:</span>
                    <span className="text-app-primary">{status}</span>
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
                    <span className="text-white">{codingProfiles.leetcode ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">CodeForces:</span>
                    <span className="text-white">{codingProfiles.codeforces ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">CodeChef:</span>
                    <span className="text-white">{codingProfiles.codechef ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">MentorPick:</span>
                    <span className="text-white">{codingProfiles.mentorpick ?? "—"}</span>
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
            {(skills.length ? skills : [
              { category: "Languages", technologies: ["Java","Python","JS"] }
            ]).map((skill: any, idx: number) => {
              // pick icon by category roughly
              const IconComp = idx === 0 ? Code : idx === 1 ? Server : idx === 2 ? Brain : Palette;
              return (
                <Card key={idx} className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <IconComp className="text-app-primary" size={24} />
                      <h3 className="text-white font-bold font-['Fira_Code']">{skill.category}</h3>
                    </div>
                    <div className="space-y-2">
                      {Array.isArray(skill.technologies) && skill.technologies.map((t: string) => (
                        <div key={t} className="text-gray text-sm">{t}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">Education</h2>
          <div className="space-y-6">
            {(education.length ? education : []).map((edu: any, i: number) => (
              <Card key={i} className="backdrop-blur-md bg-white/5 border border-white/10">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-['Fira_Code']">{edu.degree}</h3>
                      <p className="text-app-primary">{edu.field}</p>
                      <p className="text-gray">{edu.institution}</p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <span className="text-gray text-sm">{edu.period}</span>
                      {edu.grade && <div className="text-app-primary font-bold">{edu.grade}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(certifications.length ? certifications : []).map((c: string, idx: number) => (
              <Card key={idx} className="backdrop-blur-md bg-white/5 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Award className="text-app-primary mt-1" size={20} />
                    <p className="text-gray leading-relaxed">{c}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-['Fira_Code']">Achievements & Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(achievements.length ? achievements : []).map((a: string, idx: number) => (
              <Card key={idx} className="backdrop-blur-md bg-white/5 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-app-primary rounded-full mt-2" />
                    <p className="text-gray leading-relaxed">{a}</p>
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

export default About;

import React from 'react';
import { BookOpen, Award, Layers, Code, PenTool, Users, Megaphone } from 'lucide-react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Background from './components/Background';
import { EDUCATION, PUBLICATIONS, RESEARCH_EXPERIENCE, SERVICE, TEACHING, SKILLS, NEWS } from './constants';

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">{icon}</div>
    <h2 className="text-2xl font-bold text-slate-800 font-serif">{title}</h2>
  </div>
);

const getStatusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('published') || s.includes('in press')) return 'bg-green-100 text-green-800 border-green-200';
  if (s.includes('preprint')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (s.includes('review') || s.includes('revision') || s.includes('submitted')) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

// Helper component to bold the name "Y. Zhang"
const AuthorsList: React.FC<{ authors: string }> = ({ authors }) => {
  const parts = authors.split(/(Y\. Zhang)/g);
  return (
    <span className="font-medium">
      {parts.map((part, i) => 
        part === 'Y. Zhang' ? <strong key={i} className="text-slate-900 font-bold underline decoration-slate-300 underline-offset-2">{part}</strong> : part
      )}
    </span>
  );
};

function App() {
  return (
    <div className="min-h-screen relative font-sans text-slate-600">
      <Background />
      <Navigation />
      
      <main className="relative z-10 space-y-24 pb-24">
        <Hero />

        {/* News Section */}
        {NEWS.length > 0 && (
          <section id="news" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
            <SectionTitle icon={<Megaphone size={24} />} title="Latest News" />
            <div className="grid gap-6">
              {NEWS.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                  <div className="md:w-48 flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full">
                      {item.date}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        <section id="education" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <SectionTitle icon={<BookOpen size={24} />} title="Educational Experience" />
          <div className="grid gap-6 lg:grid-cols-2">
            {EDUCATION.map((edu, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{edu.institution}</h3>
                  <span className="text-sm font-medium text-accent bg-accent/10 px-2 py-1 rounded mt-2 sm:mt-0">{edu.duration}</span>
                </div>
                <div className="text-slate-800 font-semibold mb-2">{edu.degree}</div>
                {edu.gpa && <div className="text-sm text-slate-600 mb-3">GPA: <span className="font-semibold">{edu.gpa}</span></div>}
                <ul className="space-y-2">
                  {edu.details.map((detail, i) => (
                    <li key={i} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
           <SectionTitle icon={<PenTool size={24} />} title="Publications" />
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             {PUBLICATIONS.map((pub, idx) => (
               <div key={idx} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                 <div className="flex flex-col gap-2">
                    <p className="text-slate-800 text-base leading-relaxed">
                      <AuthorsList authors={pub.authors} />. "{pub.title}." <span className="italic text-slate-700">{pub.journal}</span>.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                      <span className="font-bold text-slate-900">{pub.year}</span>
                      
                      {/* Status Tag */}
                      {pub.status && (
                        <div className="flex gap-2">
                          {Array.isArray(pub.status) ? (
                            pub.status.map((s, i) => (
                              <span key={i} className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(s)}`}>
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(pub.status)}`}>
                              {pub.status}
                            </span>
                          )}
                        </div>
                      )}

                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} className="text-accent hover:underline flex items-center gap-1 ml-auto sm:ml-0">
                          DOI: {pub.doi}
                        </a>
                      )}
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Research Experience */}
        <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <SectionTitle icon={<Layers size={24} />} title="Research Experience" />
          <div className="space-y-8">
            {RESEARCH_EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-accent transition-colors"></div>
                <div className="pl-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{exp.title}</h3>
                      <div className="text-slate-700 font-medium mt-1">{exp.institution}</div>
                      {exp.advisors && <div className="text-sm text-slate-500 mt-1">Advisor(s): {exp.advisors}</div>}
                    </div>
                    <div className="mt-2 lg:mt-0 flex flex-col items-start lg:items-end gap-2">
                      <span className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded">{exp.duration}</span>
                      {exp.link && (
                        <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1">
                          View Project &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {exp.description.map((desc, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                        <span className="md:col-span-3 lg:col-span-2 text-sm font-bold text-slate-700 uppercase tracking-wide">{desc.label}</span>
                        <p className="md:col-span-9 lg:col-span-10 text-slate-600 text-sm leading-relaxed">{desc.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Teaching & Service */}
        <section id="teaching" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <SectionTitle icon={<Users size={24} />} title="Teaching Experience" />
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                 {TEACHING.map((teach, idx) => (
                   <div key={idx} className="border-l-2 border-slate-200 pl-4 py-1">
                     <h4 className="font-bold text-slate-900">{teach.course}</h4>
                     <div className="flex flex-col gap-1 mt-1">
                       <div className="flex justify-between items-center">
                         <span className="text-slate-600 text-sm">{teach.role}</span>
                         <span className="text-xs text-slate-400 font-mono">{teach.period}</span>
                       </div>
                       {teach.institution && (
                         <span className="inline-block self-start text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">
                           {teach.institution}
                         </span>
                       )}
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            <div id="service" className="scroll-mt-28">
              <SectionTitle icon={<Award size={24} />} title="Service" />
              <div className="space-y-6">
                {SERVICE.map((serv, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{serv.role}</h4>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{serv.duration}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-700 mb-3">{serv.organization}</div>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {serv.details.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <SectionTitle icon={<Code size={24} />} title="Proficiencies" />
          
          <div className="grid md:grid-cols-3 gap-8">
             {SKILLS.map((cat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm hover:border-accent/50 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-4 text-slate-100 font-serif text-lg">Yiqian Zhang</p>
            <p className="text-sm mb-8">Ph.D. Student in Biostatistics | The Ohio State University</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#hero" className="hover:text-white transition-colors">Home</a>
              <a href="#publications" className="hover:text-white transition-colors">Publications</a>
              <a href={`mailto:zhang.16383@osu.edu`} className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="mt-8 border-t border-slate-800 pt-8 text-xs text-slate-600">
              © {new Date().getFullYear()} Yiqian Zhang. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
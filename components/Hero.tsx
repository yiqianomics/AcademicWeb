import React from 'react';
import { Mail, Phone, MapPin, Linkedin, GraduationCap } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-slate-900 leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-accent">{PERSONAL_INFO.name}</span>
          </h1>
          <h2 className="text-xl sm:text-2xl text-slate-600 font-medium">
            {PERSONAL_INFO.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            {PERSONAL_INFO.summary}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8 text-sm sm:text-base text-slate-600">
            <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail size={18} /> {PERSONAL_INFO.email}
            </a>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <Phone size={18} /> {PERSONAL_INFO.phone}
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <MapPin size={18} /> {PERSONAL_INFO.location}
            </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-4">
             <a 
               href={PERSONAL_INFO.socials.linkedin} 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-blue-700 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
             >
               <Linkedin size={20} /> LinkedIn
             </a>
             
             <a 
               href={PERSONAL_INFO.socials.googleScholar} 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
             >
               <GraduationCap size={20} /> Google Scholar
             </a>

             <a 
               href={PERSONAL_INFO.socials.orcid} 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
             >
               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="opacity-90 text-[#A6CE39]">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.422.947.947s-.422.947-.947.947a.948.948 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.306v7.419h2.197c2.74 0 4.125-1.556 4.125-3.719 0-2.294-1.35-3.7-4.125-3.7h-2.197z"/>
               </svg>
               ORCID
             </a>
          </div>
        </div>

        {/* Abstract Visual Representation of "Data/Biostats" */}
        <div className="lg:col-span-1 flex justify-center lg:justify-end relative">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-100 to-white shadow-2xl flex items-center justify-center border border-slate-200 relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-50 opacity-50"></div>
            {/* Symbolic representation of microbiome/network */}
            <div className="relative z-10 grid grid-cols-4 gap-4 p-8">
               {[...Array(16)].map((_, i) => (
                 <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full bg-accent/80 transition-all duration-1000 ease-in-out group-hover:scale-150 ${i % 3 === 0 ? 'bg-slate-600' : ''}`}
                  style={{ opacity: Math.random() * 0.5 + 0.5 }}
                 ></div>
               ))}
            </div>
            <div className="absolute inset-0 border-4 border-slate-100/50 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

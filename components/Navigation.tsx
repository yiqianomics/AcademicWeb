import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#hero' },
    { name: 'News', href: '#news' },
    { name: 'Education', href: '#education' },
    { name: 'Publications', href: '#publications' },
    { name: 'Research', href: '#research' },
    { name: 'Teaching', href: '#teaching' },
    { name: 'Service', href: '#service' },
    { name: 'Skills', href: '#skills' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#hero" className={`font-serif font-bold text-xl tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-800'}`}>
              Yiqian Zhang<span className="text-accent">.</span>
            </a>
          </div>
          
          <div className="hidden md:flex space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-accent hover:bg-slate-50/50 rounded-md transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-accent hover:bg-slate-50 border-b border-slate-50 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

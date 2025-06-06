import React, { useEffect, useState } from 'react';
import { Instagram, Linkedin, Moon, Send, Sun, Twitter } from 'lucide-react';

function FooterDemo() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const socialLinks = [
    {
      icon: Twitter,
      name: 'X (Twitter)',
      href: 'https://twitter.com/piyushsahuys',
      tooltip: 'piyushsahuys'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      href: 'https://instagram.com/godsplay39',
      tooltip: '@godsplay39'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/piyush-sahu-57b43b359/',
      tooltip: 'Piyush Sahu'
    }
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <footer className="relative border-t bg-black text-white transition-colors duration-300" id='Footer'>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-muted-foreground">
              Join our community for the latest updates and exclusive offers.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm border px-4 py-2 rounded-md"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-white transition-transform hover:scale-105 flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              {['Home', 'About Us', 'Services', 'Products', 'Contact'].map((item, index) => (
                <a key={index} href="#" className="block transition-colors hover:text-primary">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>123 Innovation Street</p>
              <p>Tech City, Banglore</p>
              <p>Phone: (91) 7007337311</p>
              <p>Email: piyushsahuys@gmail.com</p>
            </address>
          </div>

          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              {socialLinks.map(({ icon: Icon, name, href, tooltip }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-full border p-2 hover:bg-[#AB1B9E] hover:text-white transition-colors"
                >
                  <div className='cursor-pointer'>
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{name}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#26193A] text-amber-100 px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tooltip}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Linkify. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((text, idx) => (
              <a key={idx} href="#" className="transition-colors hover:text-primary">
                {text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default FooterDemo;

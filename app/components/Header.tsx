'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BaggageClaim, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  setShowSidebar: (show: boolean) => void;
  showSidebar: boolean;
}

export default function Header({ setShowSidebar, showSidebar }: HeaderProps) {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showSidebar && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setShowSidebar(false)}></div>
      )}

      <header
        className={`transition-all duration-300 p-3 md:p-4 shadow-md sticky top-0 z-30 backdrop-blur-md ${
          scrolling ? 'bg-yellow-400/80' : 'bg-yellow-400/90'
        } border border-yellow-300 rounded-md`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <BaggageClaim className="h-7 w-7 mr-2 text-white" />
            <h1 className="text-xl md:text-2xl font-bold text-white">Mercado Busca</h1>
          </div>
          <Button
            className="md:hidden bg-yellow-500 p-2 rounded-full"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <SlidersHorizontal size={20} />
          </Button>
        </div>
      </header>
    </>
  );
}

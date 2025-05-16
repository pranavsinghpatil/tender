import React, { useEffect, useRef } from 'react';
import { FileCheck, FileText, Shield, Lock, BadgeCheck, FileSignature, Hash } from 'lucide-react';

const ContractIllustration: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeLinesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateCodeLines = () => {
      if (!codeLinesRef.current) return;
      
      const lines = codeLinesRef.current.querySelectorAll('.code-line');
      lines.forEach((line, index) => {
        const el = line as HTMLElement;
        el.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s forwards`;
        el.style.opacity = '0';
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCodeLines();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-80 flex items-center justify-center perspective-1000"
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.5); }
        }
        .glow-effect {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Main contract document with 3D effect */}
      <div className="relative w-72 h-72 transition-all duration-700 group hover:translate-y-[-5px] hover:rotate-x-[-5deg] hover:rotate-y-5 hover:scale-105">
        {/* Document */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-indigo-500/20 transform transition-all duration-700 group-hover:shadow-indigo-500/20 group-hover:border-indigo-400/50 glow-effect">
          {/* Document header */}
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm">
              <FileText className="h-6 w-6 text-indigo-300" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-white text-lg">Tender Contract</h3>
              <p className="text-xs text-indigo-200/80">Secure • Immutable • Transparent</p>
            </div>
          </div>
          
          {/* Animated code lines */}
          <div ref={codeLinesRef} className="space-y-3 mt-6">
            <div className="code-line flex items-center">
              <Hash className="h-3 w-3 text-indigo-400 mr-2" />
              <div className="h-2 bg-indigo-900/50 rounded-full w-24"></div>
            </div>
            <div className="code-line flex items-center ml-4">
              <div className="h-2 bg-indigo-400/60 rounded-full w-20"></div>
              <div className="h-2 bg-indigo-900/50 rounded-full w-16 ml-2"></div>
            </div>
            <div className="code-line flex items-center ml-4">
              <div className="h-2 bg-indigo-900/50 rounded-full w-28"></div>
              <div className="h-2 bg-indigo-400/60 rounded-full w-12 ml-2"></div>
            </div>
            <div className="code-line flex items-center">
              <Hash className="h-3 w-3 text-indigo-400 mr-2" />
              <div className="h-2 bg-indigo-900/50 rounded-full w-20"></div>
            </div>
            <div className="code-line flex items-center ml-4">
              <div className="h-2 bg-indigo-400/60 rounded-full w-16"></div>
              <div className="h-2 bg-indigo-900/50 rounded-full w-20 ml-2"></div>
            </div>
          </div>
          
          {/* Document footer */}
          <div className="absolute bottom-4 left-0 right-0 px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent my-4"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-indigo-500/20 rounded">
                  <Shield className="h-3 w-3 text-indigo-300" />
                </div>
                <span className="text-xs text-indigo-200/70">Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-green-500/20 rounded">
                  <BadgeCheck className="h-3 w-3 text-green-300" />
                </div>
                <span className="text-xs text-green-200/70">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center">
          <Lock className="h-3 w-3 text-indigo-300" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
          <FileCheck className="h-2.5 w-2.5 text-green-300" />
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -z-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
    </div>
  );
};

export default ContractIllustration;

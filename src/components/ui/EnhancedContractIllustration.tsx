import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Shield, Lock, BadgeCheck, FileSignature, Hash, Sparkles, CheckCircle2 } from 'lucide-react';

interface EnhancedContractIllustrationProps {
  className?: string;
}

const EnhancedContractIllustration: React.FC<EnhancedContractIllustrationProps> = ({ className = "" }) => {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 10px rgba(99, 102, 241, 0.3)",
        "0 0 20px rgba(99, 102, 241, 0.5)",
        "0 0 10px rgba(99, 102, 241, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-96 flex items-center justify-center perspective-1000 ${className}`}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>

      {/* Main contract document with 3D effect */}
      <motion.div 
        className="relative w-80 h-96 transition-all duration-700 group"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileHover={{ rotateY: 5, rotateX: -5, scale: 1.05 }}
        animate="float"
        variants={floatVariants}
      >
        {/* Document */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-indigo-500/20 transform transition-all duration-700"
          animate="glow"
          variants={glowVariants}
        >
          {/* Document header */}
          <motion.div className="flex items-center mb-6" variants={itemVariants}>
            <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm">
              <FileCheck className="h-6 w-6 text-indigo-300" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-white text-lg">Tender Contract</h3>
              <p className="text-xs text-indigo-200/80">Secure • Immutable • Transparent</p>
            </div>
          </motion.div>
          
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
          
          {/* Document features */}
          <motion.div className="mt-8 space-y-3" variants={itemVariants}>
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                <Shield className="h-4 w-4 text-indigo-300" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Enhanced Security</p>
                <p className="text-xs text-indigo-200/60">Multi-layer protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-green-500/20 rounded-lg">
                <BadgeCheck className="h-4 w-4 text-green-300" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Verified Bidding</p>
                <p className="text-xs text-green-200/60">Transparent process</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <FileSignature className="h-4 w-4 text-purple-300" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Digital Signatures</p>
                <p className="text-xs text-purple-200/60">Legally binding</p>
              </div>
            </div>
          </motion.div>
          
          {/* Document footer */}
          <motion.div className="absolute bottom-4 left-0 right-0 px-6" variants={itemVariants}>
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
                  <CheckCircle2 className="h-3 w-3 text-green-300" />
                </div>
                <span className="text-xs text-green-200/70">Verified</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div 
          className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        >
          <Lock className="h-4 w-4 text-indigo-300" />
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <FileCheck className="h-3.5 w-3.5 text-green-300" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 -right-6 w-6 h-6 rounded-full bg-yellow-500/20 backdrop-blur-sm flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        >
          <Sparkles className="h-3 w-3 text-yellow-300" />
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute -z-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
    </div>
  );
};

export default EnhancedContractIllustration;

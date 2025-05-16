import React, { useEffect, useRef, useState } from 'react';
import { 
  BadgeIndianRupee, 
  Shield, 
  CheckCircle, 
  FileCheck, 
  Zap, 
  Lock, 
  Clock, 
  Award, 
  Users, 
  FileText,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Node {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  position: { x: number; y: number };
  delay: number;
  connections: string[];
  connectionType?: 'right' | 'down' | 'diagonal';
}

const TenderPulseAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Define nodes with their positions and connections
  const nodes: Node[] = [
    {
      id: 'submit',
      icon: <FileText className="h-5 w-5" />,
      title: 'Submit',
      description: 'Tender submission',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      position: { x: 15, y: 15 },
      delay: 0.2,
      connections: ['verify', 'track'],
      connectionType: 'down'
    },
    {
      id: 'verify',
      icon: <Shield className="h-5 w-5" />,
      title: 'Verify',
      description: 'Document verification',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      position: { x: 15, y: 35 },
      delay: 0.6,
      connections: ['evaluate'],
      connectionType: 'down'
    },
    {
      id: 'evaluate',
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Evaluate',
      description: 'Bid evaluation',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      position: { x: 15, y: 55 },
      delay: 1.0,
      connections: ['award'],
      connectionType: 'diagonal'
    },
    {
      id: 'award',
      icon: <Award className="h-5 w-5" />,
      title: 'Award',
      description: 'Contract award',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      position: { x: 15, y: 75 },
      delay: 1.4,
      connections: ['payment'],
      connectionType: 'right'
    },
    {
      id: 'payment',
      icon: <BadgeIndianRupee className="h-5 w-5" />,
      title: 'Payment',
      description: 'Secure payment',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      position: { x: 40, y: 75 },
      delay: 1.8,
      connections: [],
      connectionType: 'right'
    },
    {
      id: 'track',
      icon: <Clock className="h-5 w-5" />,
      title: 'Track',
      description: 'Real-time tracking',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      position: { x: 40, y: 15 },
      delay: 2.2,
      connections: ['secure'],
      connectionType: 'down'
    },
    {
      id: 'secure',
      icon: <Lock className="h-5 w-5" />,
      title: 'Secure',
      description: 'Blockchain security',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      position: { x: 40, y: 35 },
      delay: 2.6,
      connections: ['collaborate'],
      connectionType: 'down'
    },
    {
      id: 'collaborate',
      icon: <Users className="h-5 w-5" />,
      title: 'Collaborate',
      description: 'Team collaboration',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      position: { x: 40, y: 55 },
      delay: 3.0,
      connections: ['payment'],
      connectionType: 'diagonal'
    },
  ];

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      
      // Update progress (0 to 2π)
      progressRef.current = (elapsed % 8) * (Math.PI * 2 / 8);
      
      // Find active node based on progress
      const active = nodes.find(node => 
        Math.abs(progressRef.current - node.delay) < 0.3
      );
      
      setActiveNode(active?.id || null);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  // Intersection Observer for scroll-based animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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

  // Calculate position based on percentage
  const getPosition = (node: Node) => ({
    left: `${node.position.x}%`,
    top: `${node.position.y}%`,
  });

  // Render connection between nodes
  const renderConnection = (fromId: string, toId: string, type: string = 'right') => {
    const from = nodes.find(n => n.id === fromId);
    const to = nodes.find(n => n.id === toId);
    
    if (!from || !to) return null;

    const isActive = activeNode === from.id || activeNode === to.id;
    const connectionClasses = `absolute bg-gradient-to-r ${from.color} h-0.5 ${
      isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
    } transition-all duration-500 ease-in-out`;

    switch (type) {
      case 'down':
        return (
          <div 
            className={`${connectionClasses} w-4 -right-4 top-1/2 -translate-y-1/2`}
            style={{
              transform: 'rotate(90deg)',
              transformOrigin: 'left center',
              width: `${Math.abs(to.position.y - from.position.y)}%`,
              left: '100%',
              top: '50%'
            }}
          >
            <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${to.color} ${
              isActive ? 'scale-100' : 'scale-75'
            } transition-transform duration-300`} />
          </div>
        );
      case 'diagonal':
        return (
          <div 
            className={`${connectionClasses} w-4 -right-4 top-1/2 -translate-y-1/2`}
            style={{
              transform: 'rotate(45deg)',
              transformOrigin: 'left center',
              width: `${Math.sqrt(
                Math.pow(to.position.x - from.position.x, 2) + 
                Math.pow(to.position.y - from.position.y, 2)
              )}%`,
              left: '100%',
              top: '0%'
            }}
          >
            <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${to.color} ${
              isActive ? 'scale-100' : 'scale-75'
            } transition-transform duration-300`} />
          </div>
        );
      default: // right
        return (
          <div 
            className={`${connectionClasses} w-4 -right-4 top-1/2 -translate-y-1/2`}
            style={{
              width: `${Math.abs(to.position.x - from.position.x)}%`,
              left: '100%',
              top: '50%'
            }}
          >
            <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${to.color} ${
              isActive ? 'scale-100' : 'scale-75'
            } transition-transform duration-300`} />
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black,transparent)]"></div>
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-20 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-2">
          Tender Process Flow
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience seamless tender management with our blockchain-powered platform
        </p>
      </div>

      {/* Nodes container */}
      <div className="relative z-10 w-full h-full">
        {nodes.map((node) => {
          const isActive = activeNode === node.id;
          const position = getPosition(node);
          
          return (
            <div 
              key={node.id}
              className={`absolute flex items-center justify-center transition-all duration-500 ease-out ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
              style={position}
            >
              <div 
                className={`relative flex flex-col items-center group ${node.bgColor} backdrop-blur-sm p-4 rounded-2xl border ${
                  isActive 
                    ? `border-opacity-50 shadow-lg ${node.color.replace('from-', 'border-').replace(' to-', '/50')}` 
                    : 'border-white/10 shadow-md'
                } transition-all duration-300 min-w-[120px]`}
              >
                {/* Node icon */}
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                    isActive 
                      ? `${node.color} text-white shadow-lg` 
                      : 'bg-white/5 text-gray-400'
                  } transition-all duration-300`}
                >
                  {node.icon}
                </div>
                
                {/* Node content */}
                <h3 className={`text-sm font-medium ${
                  isActive ? 'text-white' : 'text-gray-300'
                } transition-colors`}>
                  {node.title}
                </h3>
                <p className={`text-xs ${
                  isActive ? 'text-gray-300' : 'text-gray-500'
                } transition-colors`}>
                  {node.description}
                </p>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-400 animate-ping"></div>
                )}

                {/* Connection lines */}
                {node.connections.map((targetId, idx) => {
                  const target = nodes.find(n => n.id === targetId);
                  if (!target) return null;
                  
                  return (
                    <div key={`${node.id}-${targetId}-${idx}`} className="absolute inset-0 overflow-visible">
                      {renderConnection(node.id, targetId, node.connectionType)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/5 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.05 + Math.random() * 0.1
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg);
          }
          25% { 
            transform: translate(10px, 10px) rotate(5deg);
          }
          50% { 
            transform: translate(0, 20px) rotate(0deg);
          }
          75% { 
            transform: translate(-10px, 10px) rotate(-5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TenderPulseAnimation;

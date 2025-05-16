import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Lock, ArrowRight, Wallet, AlertCircle, Loader2, Sparkles, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import BlockchainAnimation from "@/components/ui/BlockchainAnimation";
import EnhancedContractIllustration from "@/components/ui/EnhancedContractIllustration";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { login, authState } = useAuth();
  const { connectWallet, account, isConnected, isConnecting } = useWeb3();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Auto-connect wallet if previously connected
    const connectOnLoad = async () => {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Auto-connect failed:", error);
      }
    };

    if (localStorage.getItem("walletConnected") === "true") {
      connectOnLoad();
    }
  }, [connectWallet]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
      toast({
        title: "Login successful",
        description: "Welcome back to TenderPulse",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully",
      });
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-indigo-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Enhanced Illustrations */}
        <div className="hidden lg:flex flex-col items-center justify-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <EnhancedContractIllustration className="w-full h-auto" />
            
            <motion.h1 
              className="text-4xl font-bold text-center mt-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome to TenderPulse
            </motion.h1>
            
            <motion.p 
              className="text-indigo-200/70 text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Secure blockchain-powered tender management platform
            </motion.p>
            
            <motion.div 
              className="mt-8 flex justify-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full bg-indigo-500/20">
                  <Shield className="h-4 w-4 text-indigo-300" />
                </div>
                <span className="text-sm text-indigo-200/70">Secure</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full bg-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                </div>
                <span className="text-sm text-green-200/70">Verified</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-full bg-purple-500/20">
                  <Sparkles className="h-4 w-4 text-purple-300" />
                </div>
                <span className="text-sm text-purple-200/70">Innovative</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500/10 filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-purple-500/10 filter blur-3xl"></div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-6 relative">
                {/* Glowing accent */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full filter blur-3xl"></div>
                
                <CardHeader className="p-0 mb-6 relative z-10">
                  <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    {isConnected
                      ? (
                        <span className="flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                          Wallet connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                        </span>
                      )
                      : "Connect your wallet to continue"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0 relative z-10">
                  {!isConnected ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <Button
                        onClick={handleConnectWallet}
                        className={cn(
                          "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                          "transition-all duration-300 flex items-center justify-center gap-2 py-6 shadow-lg shadow-indigo-900/30"
                        )}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="h-5 w-5" />
                            <span>Connect Wallet</span>
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-gray-900 px-2 text-gray-400">Blockchain Secured</span>
                        </div>
                      </div>
                      
                      <div className="h-40">
                        <BlockchainAnimation />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form 
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Username */}
                      <motion.div variants={itemVariants}>
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-gray-300 flex items-center text-sm font-medium">
                            <User className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                            Username
                          </Label>
                          <div className="relative">
                            <Input
                              id="username"
                              name="username"
                              type="text"
                              placeholder="Enter your username"
                              className={cn(
                                "bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/30 h-11",
                                "placeholder:text-gray-500 text-gray-200",
                                errors.username ? 'border-red-500/50 focus:border-red-500' : ''
                              )}
                              value={formData.username}
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                          </div>
                          {errors.username && (
                            <p className="text-xs text-red-400 mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" /> {errors.username}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Password */}
                      <motion.div variants={itemVariants}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-300 flex items-center text-sm font-medium">
                              <Lock className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                              Password
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-500 hover:text-gray-300 h-6 px-2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </Button>
                          </div>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className={cn(
                                "bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/30 h-11 pr-10",
                                "placeholder:text-gray-500 text-gray-200",
                                errors.password ? 'border-red-500/50 focus:border-red-500' : ''
                              )}
                              value={formData.password}
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-xs text-red-400 mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" /> {errors.password}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div 
                        variants={itemVariants}
                        className="pt-4"
                      >
                        <Button
                          type="submit"
                          className={cn(
                            "w-full h-12 text-white shadow-lg shadow-indigo-900/30 transition-all duration-300",
                            "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
                            "relative overflow-hidden group"
                          )}
                          disabled={isLoading || !isConnected}
                        >
                          <span className="relative z-10 flex items-center justify-center font-medium">
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              <>
                                Sign In <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </span>
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </CardContent>

                <CardFooter className="pt-6 pb-2 relative z-10">
                  <div className="w-full">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gray-900 px-2 text-gray-400">OR</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-center text-gray-400 w-full mt-4">
                      Don't have an account?{' '}
                      <Link 
                        to="/register" 
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center"
                      >
                        Create an account
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full filter blur-3xl opacity-60 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/10 rounded-full filter blur-3xl opacity-40 animate-pulse-slow animation-delay-1000"></div>
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
      </div>
      
      {/* Add this to your global CSS or create a style tag */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Wallet, Loader2, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import BlockchainNetwork from "@/components/ui/BlockchainNetwork";
import RegistrationForm from "@/components/auth/RegistrationForm";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { connectWallet, account, isConnected, isConnecting } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<"wallet" | "details">("wallet");
  const [walletConnected, setWalletConnected] = useState(false);
  const { toast } = useToast();

  // Auto-advance to details if wallet is already connected
  useEffect(() => {
    if (isConnected && formStep === "wallet") {
      setWalletConnected(true);
      // Auto-advance after a short delay for better UX
      const timer = setTimeout(() => {
        setFormStep("details");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, formStep]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
      
      // Smooth transition to next step
      setTimeout(() => {
        setFormStep("details");
      }, 500);
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: any) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to continue with registration.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        ...data,
        walletAddress: account,
      };

      const success = await register(registrationData);
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully. Please wait for approval.",
        });
        navigate("/login");
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute inset-0">
          <BlockchainNetwork />
        </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <header className="py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              TenderPulse
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-gray-800/50"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            {!isConnected ? (
              <Button 
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <div className="px-3 py-1.5 text-sm bg-gray-800/50 rounded-full border border-gray-700 text-cyan-400 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)] py-12">
          {/* Left side - Steps */}
          <motion.div 
            className="hidden lg:flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full max-w-md space-y-10">
              {/* Step 1 */}
              <motion.div 
                className={`relative pl-12 pb-10 border-l-2 ${formStep === 'wallet' ? 'border-blue-500' : walletConnected ? 'border-green-500' : 'border-gray-700'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className={`absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full ${formStep === 'wallet' ? 'bg-blue-500' : walletConnected ? 'bg-green-500' : 'bg-gray-700'}`}>
                  {walletConnected ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span className="text-white font-medium">1</span>
                  )}
                </div>
                <h3 className={`text-lg font-semibold ${formStep === 'wallet' ? 'text-white' : 'text-gray-300'}`}>
                  Connect Your Wallet
                </h3>
                <p className="text-gray-400 mt-1 text-sm">
                  Securely connect your wallet to get started with TenderPulse
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className={`relative pl-12 ${formStep === 'wallet' ? 'opacity-50' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: formStep === 'wallet' ? 0.5 : 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className={`absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full ${formStep === 'details' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  <span className="text-white font-medium">2</span>
                </div>
                <h3 className={`text-lg font-semibold ${formStep === 'details' ? 'text-white' : 'text-gray-300'}`}>
                  Complete Your Profile
                </h3>
                <p className="text-gray-400 mt-1 text-sm">
                  Fill in your details to create your account
                </p>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
              <div className="absolute -left-20 bottom-0 w-60 h-60 bg-cyan-500/10 rounded-full filter blur-3xl"></div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border-gray-800/50 shadow-xl overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Create an Account
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {formStep === 'wallet' 
                          ? 'Connect your wallet to get started' 
                          : 'Complete your registration details'}
                      </CardDescription>
                    </div>
                    {formStep === 'details' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFormStep('wallet')}
                        className="text-gray-400 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </div>
              
              <CardContent className="pt-6">
                {formStep === 'wallet' ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6 py-4"
                  >
                    <motion.div variants={itemVariants} className="text-center">
                      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/10 mb-4">
                        <Wallet className="h-10 w-10 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Connect Your Wallet
                      </h3>
                      <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Connect your wallet to create a secure and decentralized account on TenderPulse.
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnecting || isConnected}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : isConnected ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Wallet Connected
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 h-4 w-4" />
                            Connect Wallet
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-gray-900 text-gray-400">Don't have a wallet?</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-12 bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 text-white"
                        onClick={() => window.open('https://metamask.io/download.html', '_blank')}
                      >
                        <img 
                          src="/metamask-fox.svg" 
                          alt="MetaMask" 
                          className="h-5 w-5 mr-2" 
                        />
                        Install MetaMask
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <RegistrationForm 
                      onSubmit={handleRegister} 
                      isSubmitting={isSubmitting} 
                      walletAddress={account || ''}
                    />
                  </motion.div>
                )}
              </CardContent>
              
              <CardFooter className="bg-gray-900/30 px-6 py-4 border-t border-gray-800/50">
                <p className="text-sm text-gray-400 text-center w-full">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} TenderPulse. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-2">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;

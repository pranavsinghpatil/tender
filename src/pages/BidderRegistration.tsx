import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { RegisterData } from "@/types/auth";

const BidderRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle registration submission
  const handleRegister = async (data: RegisterData) => {
    try {
      // TODO: Implement registration logic with blockchain
      console.log("Registration data:", data);
      
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for review by an officer.",
      });
      
      // Redirect to dashboard or confirmation page
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to let the form component handle it
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <RegistrationForm onRegister={handleRegister} />
      </div>
    </Layout>
  );
};

export default BidderRegistration;

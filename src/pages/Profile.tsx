import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Building2, Shield, Key, Wallet, AlertTriangle, Trash2 } from "lucide-react";
import BlockchainDashboard from "@/components/blockchain/BlockchainDashboard";
import TransactionHistory from "@/components/blockchain/TransactionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { authState, deleteUser, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { toast } = useToast();
  
  const handleDeleteAccount = async () => {
    if (!password) {
      setDeleteError('Please enter your password to confirm account deletion');
      return;
    }
    
    try {
      setIsDeleting(true);
      setDeleteError('');
      
      const success = await deleteUser(authState.user!.id, password);
      
      if (success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
          variant: "default"
        });
        
        // Redirect to home page after successful deletion
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!authState.user) {
    return (
      <div className="min-h-screen bg-gray-50/0 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please login to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/0">
      <main className="container pt-20 pb-20">
        <div className="my-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-gray-400 mt-1">
            View and manage your account details and blockchain wallet
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            {authState.user.role === "bidder" && (
              <TabsTrigger value="bids">My Bids</TabsTrigger>
            )}
            {authState.user.role === "officer" && (
              <TabsTrigger value="tenders">My Tenders</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="account">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-[#1B1B1B]/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your personal and account details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-white">{authState.user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-white">{authState.user.email || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-medium capitalize text-white">{authState.user.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            authState.user.isApproved 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {authState.user.isApproved ? "Approved" : "Pending Approval"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {authState.user.walletAddress && (
                      <div className="flex items-center gap-4">
                        <Wallet className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Wallet Address</p>
                          <p className="font-mono text-sm text-green-400">
                            {authState.user.walletAddress.slice(0, 10)}...{authState.user.walletAddress.slice(-8)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {authState.user.role === "bidder" && authState.user.profileData && (
                <Card className="bg-[#1B1B1B]/40 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Your business details</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium text-white">{authState.user.profileData.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Number</p>
                      <p className="font-medium text-white">{authState.user.profileData.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GST Number</p>
                      <p className="font-medium text-white">{authState.user.profileData.gstNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PAN Number</p>
                      <p className="font-medium text-white">{authState.user.profileData.panNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-white">{authState.user.profileData.registeredAddress}</p>
                      <p className="text-sm text-white">
                        {authState.user.profileData.city}, {authState.user.profileData.state}, {authState.user.profileData.pinCode}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blockchain">
            <div className="grid gap-6 md:grid-cols-2">
              <BlockchainDashboard showTransactions={false} />
              <TransactionHistory userId={authState.user.id} limit={10} />
            </div>
          </TabsContent>

          {authState.user.role === "bidder" && (
            <TabsContent value="bids">
              <Card className="bg-[#1B1B1B]/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>My Bids</CardTitle>
                  <CardDescription>Your bidding history and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Your bid history will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {authState.user.role === "officer" && (
            <TabsContent value="tenders">
              <Card className="bg-[#1B1B1B]/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle>My Tenders</CardTitle>
                  <CardDescription>Tenders you've created and managed</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Your tender history will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        
        {/* Danger Zone */}
        <div className="mt-12 border-t border-red-200 pt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              These actions are irreversible. Please be certain.
            </p>
            
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-medium text-red-800">Delete Account</h3>
                  <p className="text-sm text-red-700">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="whitespace-nowrap">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-red-600">Delete Your Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="col-span-3"
                          placeholder="Enter your password to confirm"
                        />
                      </div>
                      
                      {deleteError && (
                        <p className="text-sm text-red-500 text-center">{deleteError}</p>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || !password}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

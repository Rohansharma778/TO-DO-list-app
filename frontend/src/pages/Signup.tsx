import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    // Since you have Google auth set up manually, this would call your auth function
    // For demo purposes, we'll navigate to homepage
    console.log('Google signup initiated');
   window.location.href = 'http://localhost:5005/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">T</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to TO-DO LIST APP</CardTitle>
          <CardDescription>
            Get organized and boost your productivity with our intuitive task management system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignup}
              className="w-full h-12 text-base font-medium"
              variant="outline"
            >
              <FcGoogle className="mr-3 h-5 w-5" />
              Continue with Google
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
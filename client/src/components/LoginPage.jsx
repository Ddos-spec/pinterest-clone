import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Pinterest Clone</CardTitle>
          <CardDescription>
            Sign in with your GitHub account to start pinning images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-2"
            size="lg"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>By signing in, you can:</p>
            <ul className="mt-2 space-y-1">
              <li>• Add your own images</li>
              <li>• Like and save images</li>
              <li>• Create your personal gallery</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;


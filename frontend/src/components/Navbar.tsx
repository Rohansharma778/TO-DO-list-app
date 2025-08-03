import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Plus, LogOut } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5005/api';

// Define the User type
interface User {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  image?: string; // Back to image
  // Add other user properties as needed
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API}/user`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        
        // Type guard for axios error
        if (axios.isAxiosError(error)) {
          // Check if it's a 404 or authentication issue
          if (error.response?.status === 404) {
            console.log('User endpoint not found - user may not be logged in');
          } else if (error.response?.status === 401) {
            console.log('User not authenticated');
            navigate('/');
          }
        }
      }
    };
    
    fetchUser();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      await axios.get('http://localhost:5005/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if logout fails, redirect user for security
      navigate('/');
    }
  };

  // Get user initials for fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Clickable Logo */}
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/home')}
        >
          <h1 className="text-xl font-bold text-primary">TO-DO LIST APP</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/add')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          
          {/* Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.image} 
              alt={user?.displayName || user?.firstName || 'User'}
            />
            <AvatarFallback className="text-xs font-semibold bg-primary/10">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
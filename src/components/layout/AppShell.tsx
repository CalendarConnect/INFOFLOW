'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  Home, 
  Edit3, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white dark:bg-gray-800 h-full transition-all duration-300 border-r border-gray-200 dark:border-gray-700 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold">FC</span>
              </div>
              <span className="ml-2 font-semibold text-gray-800 dark:text-white">FlowCanvas</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              sidebarOpen ? "px-4" : "px-2"
            )}
            onClick={() => router.push('/dashboard')}
          >
            <Home size={20} />
            {sidebarOpen && <span className="ml-2">Dashboard</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              sidebarOpen ? "px-4" : "px-2"
            )}
            onClick={() => router.push('/editor')}
          >
            <Edit3 size={20} />
            {sidebarOpen && <span className="ml-2">Editor</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              sidebarOpen ? "px-4" : "px-2"
            )}
            onClick={() => router.push('/settings')}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-2">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              sidebarOpen ? "px-4" : "px-2"
            )}
            onClick={() => router.push('/help')}
          >
            <HelpCircle size={20} />
            {sidebarOpen && <span className="ml-2">Help</span>}
          </Button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              sidebarOpen ? "px-4" : "px-2"
            )}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && (
              <span className="ml-2">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
              sidebarOpen ? "px-4" : "px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">FlowCanvas</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 
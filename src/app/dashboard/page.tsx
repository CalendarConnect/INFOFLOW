'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FlowCanvas Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to FlowCanvas</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This is the dashboard page. Here you'll be able to create and manage your flow diagrams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">Create New Flow</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Start a new flow diagram from scratch.
              </p>
              <Button className="w-full">Create New</Button>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">Templates</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Choose from pre-built flow templates.
              </p>
              <Button variant="outline" className="w-full">Browse Templates</Button>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2">Documentation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Learn how to use FlowCanvas.
              </p>
              <Button variant="outline" className="w-full">View Docs</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
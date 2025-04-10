export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl mt-2">Page not found</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Return to home
      </a>
    </div>
  );
} 
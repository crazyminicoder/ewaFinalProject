// src/pages/not-found.tsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary underline">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;

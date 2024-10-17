import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import DefaultLayout from "@/layouts/default";
import LoadingSpinner from "@/components/LoadingSpinner";  // Now exists

// Lazy-loaded components
const IndexPage = lazy(() => import("@/pages/index"));
const DocsPage = lazy(() => import("@/pages/docs"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const BlogPage = lazy(() => import("@/pages/blog"));
const AboutPage = lazy(() => import("@/pages/about"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ModelsPage = lazy(() => import("@/pages/models"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));  // Now exists
const ChatBotPage = lazy(() => import("@/pages/chat-ai"));  // New ChatBotPage component

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Wrap most routes with DefaultLayout */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:make" element={<ModelsPage />} />
          <Route path="/chat-ai" element={<ChatBotPage />} /> {/* New ChatBot route */}
          <Route path="*" element={<NotFoundPage />} /> {/* Handle 404 Not Found */}
      

        {/* Authentication Routes (without DefaultLayout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ModelsPage from "@/pages/models";
import CarDetailPage from "@/pages/cardetailpage";
import CartPage from "@/pages/cartpage";
import OrderHistory from "@/components/orderhistory";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route path="/models" element={<ModelsPage />} />          
      <Route path="/models/:make" element={<ModelsPage />} />   
      <Route path="/car/:title" element={<CarDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
}

export default App;

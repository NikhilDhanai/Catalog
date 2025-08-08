// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage"; // Import the new component

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            {/* New route for the product details page */}
            <Route
              path="/products/:id/:productName"
              element={<ProductDetailPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

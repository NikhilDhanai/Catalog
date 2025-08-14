// src/pages/CatalogPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductListings, getProductTypes } from "../services/api";
import type { Product, ProductType } from "../types";

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getProductTypes();
        setProductTypes(types);
      } catch (err) {
        console.error("Error fetching product types:", err);
      }
    };
    fetchTypes();
  }, []);

  // Fetch products whenever the selected type changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductListings(selectedTypeId);
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please check the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedTypeId]);

  const groupProductsByType = (products: Product[]) => {
    return products.reduce((groups, product) => {
      const type = product.product_type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(product);
      return groups;
    }, {} as Record<string, Product[]>);
  };

  const groupedProducts = groupProductsByType(products);

  // Function to create a URL-friendly slug
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-extrabold py-8">
        Product Catalog
      </h1>

      {/* Dropdown Menu for Filtering */}
      <div className="mb-6">
        <select
          value={selectedTypeId ?? ""}
          onChange={(e) =>
            setSelectedTypeId(e.target.value ? Number(e.target.value) : null)
          }
          className="block w-full md:w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Products</option>
          {productTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center p-4">Loading products...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {selectedTypeId === null ? (
            // Render grouped view for "All Products"
            Object.entries(groupedProducts).map(([type, productList]) => (
              <div key={type} className="mb-8">
                <h2 className="text-2xl font-bold border-b pb-2 mb-4">
                  {type}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productList.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {/* Image with slant and wipe animation */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden group">
                        {product.image_urls &&
                          product.image_urls.length > 0 && (
                            <img
                              src={product.image_urls[0]}
                              alt={product.name}
                              className="w-full h-full object-cover absolute"
                            />
                          )}
                        {/* Overlay with wipe animation */}
                        <div className="absolute inset-0 bg-indigo-500 opacity-30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-200/50 to-transparent transform -skew-y-3 origin-bottom-left" />
                      </div>
                      <div className="p-4">
                        {/* Product Name */}
                        <h3 className="text-xl font-bold mb-2">
                          {product.name}
                        </h3>
                        {/* Product Description */}
                        <p className="text-gray-600 text-sm mb-4">
                          {product.description}
                        </p>
                        {/* Details Button - UPDATED */}
                        <Link
                          to={`/products/${product.id}/${createSlug(
                            product.name
                          )}`}
                          className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Render flat list for a specific filter
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Image with slant and wipe animation */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden group">
                    {product.image_urls && product.image_urls.length > 0 && (
                      <img
                        src={product.image_urls[0]}
                        alt={product.name}
                        className="w-full h-full object-cover absolute"
                      />
                    )}

                    {/* Overlay with wipe animation */}
                    <div className="absolute inset-0 bg-indigo-500 opacity-30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-200/50 to-transparent transform -skew-y-3 origin-bottom-left" />
                  </div>
                  <div className="p-4">
                    {/* Product Name */}
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    {/* Product Description */}
                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>
                    {/* Details Button - UPDATED */}
                    <Link
                      to={`/products/${product.id}/${createSlug(product.name)}`}
                      className="inline-block bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="text-center p-4">
          No products found for this category.
        </div>
      )}
    </div>
  );
};
export default CatalogPage;

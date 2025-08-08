// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getProductListings } from "../services/api";
import type { Product, Variant, Addon } from "../types";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const allProducts = await getProductListings();
        const foundProduct = allProducts.find((p) => p.id === Number(id));
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0]);
          }
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleVariantChange = (variantId: number) => {
    const newVariant = product?.variants.find((v) => v.id === variantId);
    if (newVariant) {
      setSelectedVariant(newVariant);
      setQuantity(1);
    }
  };

  const handleAddonChange = (addon: Addon, isChecked: boolean) => {
    setSelectedAddons((prev) => {
      if (isChecked) {
        return [...prev, addon];
      } else {
        return prev.filter((a) => a.id !== addon.id);
      }
    });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prevQuantity) => {
      if (type === "increment") {
        const maxStock = selectedVariant?.stock ?? 999;
        return prevQuantity < maxStock ? prevQuantity + 1 : prevQuantity;
      } else {
        return prevQuantity > 1 ? prevQuantity - 1 : 1;
      }
    });
  };

  const totalPrice = useMemo(() => {
    const variantPrice = selectedVariant ? selectedVariant.price : 0;
    const addonsPrice = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    return (variantPrice + addonsPrice) * quantity;
  }, [selectedVariant, selectedAddons, quantity]);

  if (loading) {
    return <div className="text-center p-4">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center p-4">Product not available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
           {" "}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>     
         {" "}
        <div className="flex flex-col md:flex-row gap-8">
                    {/* Product Image */}         {" "}
          <div className="md:w-1/2">
                     {" "}
            {product.image_urls && product.image_urls.length > 0 && (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-md"
              />
            )}
                     {" "}
          </div>
                    {/* Product Details */}         {" "}
          <div className="md:w-1/2 flex flex-col">
                       {" "}
            <p className="text-gray-600 text-lg mb-4">{product.description}</p> 
                      {/* Variants Section */}           {" "}
            <div className="mb-6">
                            <h2 className="text-xl font-bold mb-2">Variants</h2>
                           {" "}
              {product.variants.map((variant) => (
                <label key={variant.id} className="block mb-2">
                                   {" "}
                  <input
                    type="radio"
                    name="variant"
                    value={variant.id}
                    checked={selectedVariant?.id === variant.id}
                    onChange={() => handleVariantChange(variant.id)}
                    className="mr-2"
                  />
                                    {variant.size} - ₹{variant.price.toFixed(2)}
                                   {" "}
                  <span className="ml-2 text-sm text-gray-500">
                                        (SKU: {variant.sku})                  {" "}
                  </span>
                                 {" "}
                </label>
              ))}
                       {" "}
            </div>
                      {/* Add-ons Section (Conditional for food items) */}     
               {" "}
            {product.product_type === "food" &&
              product.addons &&
              product.addons.length > 0 && (
                <div className="mb-6">
                                 {" "}
                  <h2 className="text-xl font-bold mb-2">Add-ons</h2>           
                     {" "}
                  {product.addons.map((addon) => (
                    <label key={addon!.id} className="block mb-2">
                                         {" "}
                      <input
                        type="checkbox"
                        checked={selectedAddons.some((a) => a.id === addon!.id)}
                        onChange={(e) =>
                          handleAddonChange(addon!, e.target.checked)
                        }
                        className="mr-2"
                      />
                                          {addon!.name} (+₹
                      {addon!.price.toFixed(2)})                  {" "}
                    </label>
                  ))}
                               {" "}
                </div>
              )}
                        {/* Quantity Control */}           {" "}
            <div className="mb-6">
                            <h2 className="text-xl font-bold mb-2">Quantity</h2>
                           {" "}
              <div className="flex items-center space-x-4">
                               {" "}
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="w-10 h-10 bg-gray-200 text-gray-700 rounded-md text-center text-2xl font-bold transition-transform duration-100 ease-in-out active:scale-95 disabled:opacity-50"
                >
                                    -                {" "}
                </button>
                               {" "}
                <span className="text-xl font-bold w-8 text-center">
                  {quantity}
                </span>
                               {" "}
                <button
                  onClick={() => handleQuantityChange("increment")}
                  disabled={selectedVariant?.stock === quantity}
                  className="w-10 h-10 bg-gray-200 text-gray-700 rounded-md text-2xl font-bold text-center transition-transform duration-100 ease-in-out active:scale-95 disabled:opacity-50"
                >
                                    +                {" "}
                </button>
                           {" "}
              </div>
                       {" "}
            </div>
                      {/* Price Display */}         {" "}
            <div className="flex justify-between items-center mt-auto">
                         {" "}
              <span className="text-2xl font-bold">
                              Total Price: ₹{totalPrice.toFixed(2)}           {" "}
              </span>
                         {" "}
              <span className="text-gray-500">
                              Stock: {selectedVariant?.stock ?? "N/A"}         
                 {" "}
              </span>
                       {" "}
            </div>
                   {" "}
          </div>
               {" "}
        </div>
           {" "}
      </div>
    </div>
  );
};

export default ProductDetailPage;

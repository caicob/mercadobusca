'use client';

import { Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  shipping: {
    free_shipping: boolean;
  };
  seller: {
    id: number;
  };
}

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string;
  viewProductDetails: (productId: string, sellerId: number) => Promise<void>;
}

export default function ProductList({ products, loading, error, viewProductDetails }: ProductListProps) {
  return (
    <section className="flex-1 p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && !error && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-yellow-400" />
          <span className="ml-2 text-xl">Carregando produtos...</span>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Resultados da Busca ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewProductDetails={viewProductDetails} 
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
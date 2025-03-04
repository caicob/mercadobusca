'use client';

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

interface ProductCardProps {
  product: Product;
  viewProductDetails: (productId: string, sellerId: number) => Promise<void>;
}

export default function ProductCard({ product, viewProductDetails }: ProductCardProps) {
  return (
    <div
      key={product.id}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
      onClick={() => viewProductDetails(product.id, product.seller.id)}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={product.thumbnail.replace('http:', 'https:')}
          alt={product.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{product.title}</h3>
        <p className="text-2xl font-bold text-gray-800 mb-2">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: product.currency_id,
          }).format(product.price)}
        </p>
        <p className="text-sm text-gray-500">
          {product.shipping.free_shipping && (
            <span className="text-green-600 font-semibold">Frete Grátis</span>
          )}
        </p>
      </div>
    </div>
  );
}
'use client';

import { X } from 'lucide-react';

interface ProductDetails {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  condition: string;
  sold_quantity: number;
  shipping?: {
    free_shipping: boolean;
  };
  pictures?: {
    secure_url: string;
  }[];
  thumbnail: string;
  permalink: string;
  attributes?: {
    id: string;
    name: string;
    value_name: string;
  }[];
}

interface SellerDetails {
  id: number;
  nickname: string;
  seller_reputation?: {
    level_id: string;
  };
}

interface ProductModalProps {
  productDetails: ProductDetails;
  sellerDetails: SellerDetails | null;
  closeModal: () => void;
  redirectToProductPage: () => void;
}

export default function ProductModal({
  productDetails,
  sellerDetails,
  closeModal,
  redirectToProductPage
}: ProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{productDetails.title}</h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <img
                  src={productDetails.pictures?.[0]?.secure_url || productDetails.thumbnail}
                  alt={productDetails.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              {productDetails.pictures && productDetails.pictures.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {productDetails.pictures.slice(0, 5).map((pic, index) => (
                    <img
                      key={index}
                      src={pic.secure_url}
                      alt={`Visualização do produto ${index + 1}`}
                      className="w-full h-16 object-cover rounded border hover:border-yellow-400 cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Condição: {productDetails.condition === 'new' ? 'Novo' : 'Usado'}
                </span>
                {productDetails.sold_quantity > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    | {productDetails.sold_quantity} vendidos
                  </span>
                )}
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: productDetails.currency_id,
                }).format(productDetails.price)}
              </h3>
              
              {productDetails.shipping?.free_shipping && (
                <p className="text-green-600 font-semibold mb-4">Frete Grátis</p>
              )}
              
              <div className="mb-6">
                <button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition duration-200"
                  onClick={redirectToProductPage}
                >
                  Ir ao Mercado Livre
                </button>
              </div>
              
              {sellerDetails && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Informações do Vendedor</h4>
                  <p>{sellerDetails.nickname}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">
                      {sellerDetails.seller_reputation?.level_id || 'Novo Vendedor'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {productDetails.attributes && productDetails.attributes.length > 0 && (
            <div className="mt-8 border-t pt-4">
              <h4 className="font-semibold mb-4">Especificações do Produto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productDetails.attributes.map((attr) => (
                  <div key={attr.id} className="flex">
                    <span className="font-medium w-1/3">{attr.name}:</span>
                    <span className="w-2/3">{attr.value_name || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
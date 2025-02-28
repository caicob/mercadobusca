'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Loader2, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import ProductModal from './ProductModal';
import { Button } from '@/components/ui/button';

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

interface Category {
  id: string;
  name: string;
}

interface FilterValue {
  id: string;
  name: string;
  results: number;
}

interface AvailableFilter {
  id: string;
  name: string;
  values: FilterValue[];
}

interface PriceRange {
  min: string;
  max: string;
}

interface SelectedFilters {
  [key: string]: string[];
}

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

export default function PageMercado() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [sellerDetails, setSellerDetails] = useState<SellerDetails | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' });
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [condition, setCondition] = useState('all');
  const [availableFilters, setAvailableFilters] = useState<AvailableFilter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [expandedFilterGroups, setExpandedFilterGroups] = useState<Record<string, boolean>>({});

  // Fetch categories on component mount
  useEffect(() => {
    fetch('https://api.mercadolibre.com/sites/MLB/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError('Falha ao carregar categorias. Por favor, tente novamente mais tarde.');
      });
  }, []);

  const searchProducts = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setProducts([]);
    setAvailableFilters([]);
    
    try {
      let url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(searchTerm)}`;
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      if (sortBy === 'price_asc') {
        url += '&sort=price_asc';
      } else if (sortBy === 'price_desc') {
        url += '&sort=price_desc';
      }
      
      if (priceRange.min) {
        url += `&price_min=${priceRange.min}`;
      }
      
      if (priceRange.max) {
        url += `&price_max=${priceRange.max}`;
      }
      
      if (freeShippingOnly) {
        url += '&shipping=free';
      }
      
      if (condition !== 'all') {
        url += `&ITEM_CONDITION=${condition}`;
      }
      
      // Add any selected filters from the available filters
      Object.entries(selectedFilters).forEach(([id, values]) => {
        if (values && values.length > 0) {
          values.forEach(value => {
            url += `&${id}=${value}`;
          });
        }
      });
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setProducts(data.results);
        if (data.available_filters) {
          setAvailableFilters(data.available_filters);
        }
        if (data.filters) {
          // Initialize expanded state for filter groups
          const initialExpandedState: Record<string, boolean> = {};
          data.filters.forEach((filter: { id: string }) => {
            initialExpandedState[filter.id] = true; // Start with all expanded
          });
          setExpandedFilterGroups(initialExpandedState);
        }
      } else {
        setError('Nenhum produto encontrado. Tente um termo de busca diferente.');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Falha ao buscar produtos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const viewProductDetails = async (productId: string, sellerId: number) => {
    setLoading(true);
    setError('');
    setProductDetails(null);
    setSellerDetails(null);
    
    try {
      // Fetch product details
      const productResponse = await fetch(`https://api.mercadolibre.com/items/${productId}`);
      const productData = await productResponse.json();
      setProductDetails(productData);
      
      // Fetch seller details
      const sellerResponse = await fetch(`https://api.mercadolibre.com/users/${sellerId}`);
      const sellerData = await sellerResponse.json();
      setSellerDetails(sellerData);
      
      setShowProductModal(true);
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('Falha ao carregar detalhes do produto. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowProductModal(false);
  };

  const redirectToProductPage = () => {
    if (productDetails && productDetails.permalink) {
      // Open product page in a new tab
      window.open(productDetails.permalink, '_blank');
    }
  };

  const toggleFilterGroup = (filterId: string) => {
    setExpandedFilterGroups(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  const handleFilterChange = (filterId: string, value: string, isChecked: boolean) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterId] || [];
      
      if (isChecked) {
        return {
          ...prev,
          [filterId]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [filterId]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const applyFilters = () => {
    searchProducts();
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setFreeShippingOnly(false);
    setCondition('all');
    setSelectedFilters({});
    searchProducts();
  };

  // Helper function to render sidebar content
  const renderSidebarContent = () => {
    return (
      <>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Faixa de Preço</h3>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Mín"
              className="w-full p-2 border border-gray-300 rounded"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Máx"
              className="w-full p-2 border border-gray-300 rounded"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Condição</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="condition"
                value="all"
                checked={condition === 'all'}
                onChange={() => setCondition('all')}
              />
              <span>Todos</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="condition"
                value="new"
                checked={condition === 'new'}
                onChange={() => setCondition('new')}
              />
              <span>Novo</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="condition"
                value="used"
                checked={condition === 'used'}
                onChange={() => setCondition('used')}
              />
              <span>Usado</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={freeShippingOnly}
              onChange={(e) => setFreeShippingOnly(e.target.checked)}
            />
            <span>Apenas Frete Grátis</span>
          </label>
        </div>

        {availableFilters.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Filtros Adicionais</h3>
            {availableFilters.map(filter => (
              <div key={filter.id} className="mb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilterGroup(filter.id)}
                >
                  <h4 className="font-medium">{filter.name}</h4>
                  {expandedFilterGroups[filter.id] ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                
                {expandedFilterGroups[filter.id] && (
                  <div className="mt-2 pl-2">
                    {filter.values.slice(0, 5).map(value => (
                      <label key={value.id} className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.id]?.includes(value.id) || false}
                          onChange={(e) => handleFilterChange(filter.id, value.id, e.target.checked)}
                        />
                        <span>{value.name} ({value.results})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-yellow-400 p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-8 text-white w-8 mr-2" />
            <h1 className="text-2xl text-white font-bold">MercadoBusca</h1>
          </div>
          <button 
            className="md:hidden bg-yellow-500 p-2 rounded-full"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>

      <div className="container mx-auto flex flex-col md:flex-row">
        {/* Sidebar for filters - Mobile */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="bg-white h-full w-4/5 max-w-sm overflow-y-auto p-4 animate-slide-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filtros</h2>
                <button 
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={() => setShowSidebar(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              {renderSidebarContent()}
              
              <div className="mt-6 flex gap-2">
                <Button 
                  className="flex-1 text-white bg-yellow-400 hover:bg-yellow-500 font-bold py-2 px-4 rounded-lg"
                  onClick={applyFilters}
                >
                  Aplicar Filtros
                </Button>
                <button 
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                  onClick={resetFilters}
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <section className="w-full p-4 mt-6">
          <form onSubmit={searchProducts} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="search" className="block text-sm font-medium text-white mb-1">
                  Buscar Produtos
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="O que você está procurando?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas as Categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar Por
                </label>
                <select
                  id="sort"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevância</option>
                  <option value="price_asc">Preço: Menor para Maior</option>
                  <option value="price_desc">Preço: Maior para Menor</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Buscando...
                </>
              ) : (
                <>
                  <Filter className="text-white mr-2" />
                  Buscar Produtos
                </>
              )}
            </button>
          </form>
        </section>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row">
        {/* Sidebar for filters - Desktop */}
        <aside className="hidden md:block w-64 p-4">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            
            {renderSidebarContent()}
            
            <div className="mt-6 flex flex-col gap-2">
              <button 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </button>
              <button 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                onClick={resetFilters}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </aside>

        {/* Results Section */}
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
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Product Details Modal */}
      {showProductModal && productDetails && (
        <ProductModal
          productDetails={productDetails}
          sellerDetails={sellerDetails}
          closeModal={closeModal}
          redirectToProductPage={redirectToProductPage}
        />
      )}
    </div>
  );
}
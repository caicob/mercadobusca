'use client';

import { useState, useEffect, FormEvent } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';

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

export default function Home() {
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

  const searchProducts = async (e?: FormEvent) => {
    e?.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setProducts([]);
    setAvailableFilters([]);
    
    try {
      let url = `https://hubiss.com.br/true-sort?q=${encodeURIComponent(searchTerm)}`;
      
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
      
      // Certificando-se de que o filtro de condição está sendo corretamente aplicado
      if (condition !== 'all') {
        url += `&ITEM_CONDITION=${condition}`;
      }
      
      // Adicionando filtros selecionados
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
          // Inicializando estado de expansão para grupos de filtros
          const initialExpandedState: Record<string, boolean> = {};
          data.filters.forEach((filter: { id: string }) => {
            initialExpandedState[filter.id] = true; // Começar com todos expandidos
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header setShowSidebar={setShowSidebar} showSidebar={showSidebar} />

      <div className="container mx-auto flex flex-col md:flex-row">
        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          loading={loading}
          searchProducts={searchProducts}
        />
      </div>

      <div className="container mx-auto flex flex-col md:flex-row">
        <Sidebar 
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          condition={condition}
          setCondition={setCondition}
          freeShippingOnly={freeShippingOnly}
          setFreeShippingOnly={setFreeShippingOnly}
          availableFilters={availableFilters}
          selectedFilters={selectedFilters}
          expandedFilterGroups={expandedFilterGroups}
          toggleFilterGroup={toggleFilterGroup}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />

        <ProductList
          products={products}
          loading={loading}
          error={error}
          viewProductDetails={viewProductDetails}
        />
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

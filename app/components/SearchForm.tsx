'use client';

import { Button } from '@/components/ui/button';
import { Search, Filter, Loader2 } from 'lucide-react';
import { FormEvent } from 'react';

interface Category {
  id: string;
  name: string;
}

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: Category[];
  loading: boolean;
  searchProducts: (e?: FormEvent) => Promise<void>;
}

export default function SearchForm({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  loading,
  searchProducts
}: SearchFormProps) {
  return (
    <section className="w-full p-4 mt-6">
      <form onSubmit={searchProducts} className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
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
        
        <Button
          type="submit"
          className="mt-4 h-12 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Buscando...
            </>
          ) : (
            <>
              <Filter className="mr-2 w-10 h-10 text-white" />
              <h2 className='text-white font-semibold text-xl'>Buscar Produtos</h2>
            </>
          )}
        </Button>
      </form>
    </section>
  );
}
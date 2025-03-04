import { X } from 'lucide-react';
import FilterContent from './FilterContent';

interface PriceRange {
  min: string;
  max: string;
}

interface SelectedFilters {
  [key: string]: string[];
}

interface AvailableFilter {
  id: string;
  name: string;
  values: {
    id: string;
    name: string;
    results: number;
  }[];
}

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  condition: string;
  setCondition: (condition: string) => void;
  freeShippingOnly: boolean;
  setFreeShippingOnly: (free: boolean) => void;
  availableFilters: AvailableFilter[];
  selectedFilters: SelectedFilters;
  expandedFilterGroups: Record<string, boolean>;
  toggleFilterGroup: (filterId: string) => void;
  handleFilterChange: (filterId: string, value: string, isChecked: boolean) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

export default function Sidebar({
  showSidebar,
  setShowSidebar,
  priceRange,
  setPriceRange,
  condition,
  setCondition,
  freeShippingOnly,
  setFreeShippingOnly,
  availableFilters,
  selectedFilters,
  expandedFilterGroups,
  toggleFilterGroup,
  handleFilterChange,
  applyFilters,
  resetFilters
}: SidebarProps) {

  const buildUrlWithFilters = () => {
    let url = '';

    // Filtro de faixa de preço
    if (priceRange.min || priceRange.max) {
      url += `&price=${priceRange.min ? priceRange.min : '*'}-${priceRange.max ? priceRange.max : '*'}`;
    }

    // Mapeamento das condições
    const conditionMap: { [key: string]: string } = {
      novo: '2230284',
      usado: '2230581',
      recondicionado: '2230582'
    };

    // Adiciona a condição, se houver
    if (conditionMap[condition]) {
      url += `&ITEM_CONDITION=${conditionMap[condition]}`;
    }

    // Adicionar filtros adicionais
    Object.entries(selectedFilters).forEach(([filterId, values]) => {
      if (values && values.length > 0) {
        values.forEach(value => {
          url += `&${filterId}=${value}`;
        });
      }
    });

    return url;
  };

  return (
    <>
      {/* Sidebar para filtros - Mobile */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 md:hidden">
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

            <div className="max-h-[80vh] overflow-y-auto"> {/* Adicionado scroll */}
              <FilterContent
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
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg"
                onClick={() => {
                  applyFilters();
                  console.log(buildUrlWithFilters()); // Debug: Verifique a URL gerada
                }}
              >
                Aplicar Filtros
              </button>
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

      {/* Sidebar para filtros - Desktop */}
      <aside className="hidden md:block w-64 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
          <h2 className="text-xl font-bold mb-4">Filtros</h2>

          <div className="max-h-[80vh] overflow-y-auto"> {/* Adicionado scroll */}
            <FilterContent
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
            />
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg"
              onClick={() => {
                applyFilters();
                console.log(buildUrlWithFilters()); // Debug: Verifique a URL gerada
              }}
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
    </>
  );
}


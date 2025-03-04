'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

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

interface FilterContentProps {
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
}

export default function FilterContent({
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
  handleFilterChange
}: FilterContentProps) {
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
}
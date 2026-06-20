import React, { useState, useEffect, useRef } from 'react';

export default function SearchableModelDropdown({ models, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredModels = models.filter(m => 
    m.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className={`w-full px-4 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 outline-none text-sm shadow-sm flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate">{value || "Select a model..."}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search models (e.g. 'free', 'gpt')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredModels.length > 0 ? (
              filteredModels.map(m => (
                <div
                  key={m}
                  className={`px-4 py-2 text-sm cursor-pointer rounded-lg transition-colors ${m === value ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                  onClick={() => {
                    onChange(m);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {m}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center italic">No models found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '@/lib/store/searchStore';
import { useListingStore } from '@/lib/store/listingStore';

interface SearchBarProps {
  variant?: 'hero' | 'header' | 'mobile';
  autoFocus?: boolean;
}

export default function SearchBar({ variant = 'hero', autoFocus = false }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { query, recentSearches, popularSearches, setQuery, addRecentSearch } = useSearchStore();
  const { listings } = useListingStore();
  const navigate = useNavigate();

  const suggestions = localQuery.trim().length > 0
    ? listings
        .filter((listing: any) => {
          const q = localQuery.toLowerCase();
          return (
            listing.title?.toLowerCase().includes(q) ||
            listing.description?.toLowerCase().includes(q) ||
            listing.game?.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    
    setQuery(trimmed);
    addRecentSearch(trimmed);
    setIsOpen(false);
    setLocalQuery('');
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + (localQuery.trim() === '' ? recentSearches.length + popularSearches.length : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        if (suggestions.length > 0 && selectedIndex < suggestions.length) {
          handleSearch(suggestions[selectedIndex].title);
        } else {
          const offset = suggestions.length;
          const remaining = localQuery.trim() === '' ? [...recentSearches, ...popularSearches] : [];
          if (remaining[selectedIndex - offset]) {
            handleSearch(remaining[selectedIndex - offset]);
          }
        }
      } else {
        handleSearch(localQuery || query);
      }
    }
  };

  const isHero = variant === 'hero';
  const isHeader = variant === 'header';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`relative ${isHero ? 'w-full' : ''}`}>
        <SearchIcon className={`absolute ${isHero ? 'left-6' : 'left-4'} top-1/2 -translate-y-1/2 ${isHero ? 'w-6 h-6' : 'w-5 h-5'} text-neutral-400`} />
        <input
          ref={inputRef}
          type="text"
          value={localQuery || query}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isHero ? 'Oyun adı, hesap veya item ara...' : 'İlan ara...'}
          className={`w-full ${
            isHero
              ? 'px-16 py-5 text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder:text-neutral-300 focus:outline-none focus:border-accent-400 focus:bg-white/15 transition-all'
              : isHeader
              ? 'pl-11 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900 transition-all w-48 lg:w-64'
              : 'pl-11 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-xl text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-primary-500 transition-all'
          }`}
          autoFocus={autoFocus}
        />
        {(localQuery || query) && (
          <button
            onClick={() => {
              setLocalQuery('');
              setQuery('');
              inputRef.current?.focus();
            }}
            className={`absolute ${isHero ? 'right-6' : 'right-3'} top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors`}
          >
            <X className={`${isHero ? 'w-5 h-5' : 'w-4 h-4'} text-neutral-500`} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${
              isHero 
                ? 'top-full mt-3 left-0 w-full' 
                : 'top-full mt-2 w-full'
            } bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50`}
          >
            <div className="max-h-96 overflow-y-auto">
              {suggestions.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    İlanlar
                  </div>
                  {suggestions.map((listing: any, index: number) => (
                    <button
                      key={listing.id}
                      onClick={() => handleSearch(listing.title)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                        selectedIndex === index ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-neutral-800 dark:to-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                        {listing.images?.[0] ? (
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <SearchIcon className="w-5 h-5 text-primary-400 m-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {listing.title}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {listing.game} • {listing.category}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(listing.price)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {localQuery.trim() === '' && (
                <>
                  {recentSearches.length > 0 && (
                    <div className="p-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Son Aramalar
                        </div>
                        <button
                          onClick={() => useSearchStore.getState().clearRecentSearches()}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Temizle
                        </button>
                      </div>
                      {recentSearches.map((search: string, index: number) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          onMouseEnter={() => setSelectedIndex(suggestions.length + index)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                            selectedIndex === suggestions.length + index ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <Clock className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1 truncate">{search}</span>
                          <X
                            onClick={(e) => {
                              e.stopPropagation();
                              useSearchStore.getState().removeRecentSearch(search);
                            }}
                            className="w-4 h-4 text-neutral-400 hover:text-red-500 transition-colors"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="px-3 py-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Popüler Aramalar
                    </div>
                    {popularSearches.map((search: string, index: number) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        onMouseEnter={() => setSelectedIndex(suggestions.length + recentSearches.length + index)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                          selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 text-accent-500 flex-shrink-0" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">{search}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {localQuery.trim() !== '' && suggestions.length === 0 && (
                <div className="p-8 text-center">
                  <SearchIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    "<span className="font-semibold text-neutral-700 dark:text-neutral-300">{localQuery}</span>" için sonuç bulunamadı
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Farklı anahtar kelimeler deneyin</p>
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-[10px]">↑↓</kbd> Gez</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-[10px]">↵</kbd> Seç</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 text-[10px]">esc</kbd> Kapat</span>
              </div>
              <button
                onClick={() => handleSearch(localQuery || query)}
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
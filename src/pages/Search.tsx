import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Filter, TrendingUp, Gamepad2 } from 'lucide-react';
import { useListingStore } from '@/lib/store/listingStore';
import { useSearchStore } from '@/lib/store/searchStore';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ListingCard from '@/components/features/ListingCard';
import SearchBar from '@/components/features/SearchBar';
import SEO from '@/components/seo/SEO';
import type { Listing } from '@/lib/shared/types';

type SortOption = 'relevance' | 'newest' | 'price-asc' | 'price-desc';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, isLoading, fetchListings } = useListingStore();
  const { addRecentSearch } = useSearchStore();

  const query = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedGame, setSelectedGame] = useState<string>('');

  useEffect(() => {
    if (query) {
      addRecentSearch(query);
      fetchListings({ status: 'active' });
    }
  }, [query, fetchListings, addRecentSearch]);

  const filteredListings = useMemo(() => {
    if (!query) return [];

    const q = query.toLowerCase();
    let result = listings.filter((listing: Listing) => {
      const matchesQuery =
        listing.title?.toLowerCase().includes(q) ||
        listing.description?.toLowerCase().includes(q) ||
        listing.game?.toLowerCase().includes(q) ||
        listing.category?.toLowerCase().includes(q);
      
      const matchesGame = !selectedGame || listing.game === selectedGame;
      
      return matchesQuery && matchesGame;
    });

    switch (sortBy) {
      case 'newest':
        result.sort((a: Listing, b: Listing) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-asc':
        result.sort((a: Listing, b: Listing) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a: Listing, b: Listing) => b.price - a.price);
        break;
      default:
        result.sort((a: Listing, b: Listing) => {
          const aTitle = a.title?.toLowerCase().includes(q) ? 1 : 0;
          const bTitle = b.title?.toLowerCase().includes(q) ? 1 : 0;
          return bTitle - aTitle;
        });
    }

    return result;
  }, [listings, query, sortBy, selectedGame]);

  const availableGames = useMemo(() => {
    const games = new Set<string>();
    const q = query.toLowerCase();
    listings.forEach((listing: Listing) => {
      if (
        listing.title?.toLowerCase().includes(q) ||
        listing.description?.toLowerCase().includes(q) ||
        listing.game?.toLowerCase().includes(q)
      ) {
        if (listing.game) games.add(listing.game);
      }
    });
    return Array.from(games);
  }, [listings, query]);

  const handleQueryChange = (newQuery: string) => {
    setSearchParams({ q: newQuery }, { replace: true });
  };

  return (
    <>
      <SEO
        title={`${query ? `"${query}" Arama Sonuçları` : 'Arama'} - Item Sepetim`}
        description={`"${query}" için arama sonuçları. Oyun hesapları ve itemler.`}
        url={`/search?q=${encodeURIComponent(query)}`}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 text-center">
              {query ? `"${query}" için sonuçlar` : 'İlan Ara'}
            </h1>
            <SearchBar variant="hero" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Oyun:</span>
              <button
                onClick={() => setSelectedGame('')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  !selectedGame ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Tümü
              </button>
              {availableGames.map((game: string) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    selectedGame === game ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Gamepad2 className="w-3 h-3" />
                  {game}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-lg text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-primary-500"
              >
                <option value="relevance">Alaka Düzeyi</option>
                <option value="newest">En Yeni</option>
                <option value="price-asc">En Ucuz</option>
                <option value="price-desc">En Pahalı</option>
              </select>
            </div>
          </motion.div>

          {!isLoading && (
            <div className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{filteredListings.length}</span> sonuç bulundu
              {selectedGame && <span> • <span className="font-medium">{selectedGame}</span> filtresi aktif</span>}
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i: number) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!isLoading && filteredListings.length > 0 && (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredListings.map((listing: Listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredListings.length === 0 && query && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6">
                <SearchIcon className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                Sonuç Bulunamadı
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                "<span className="font-semibold">{query}</span>" için ilan bulunamadı. Farklı anahtar kelimeler deneyin.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {useSearchStore.getState().popularSearches.slice(0, 4).map((search: string) => (
                  <button
                    key={search}
                    onClick={() => handleQueryChange(search)}
                    className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Grid3X3, List, 
  ChevronDown, Check, Gamepad2, Tag, TrendingUp,
  TrendingDown, Clock, Filter
} from 'lucide-react';
import { GAME_CATEGORIES } from '@/lib/shared/constants';
import { useListingStore } from '@/lib/store/listingStore';
import { SkeletonCard } from '@/components/ui/Skeleton';
import ListingCard from '@/components/features/ListingCard';
import SEO from '@/components/seo/SEO';
import { formatPrice } from '@/lib/shared/utils';
import type { Listing } from '@/lib/shared/types';

type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';
type ViewMode = 'grid' | 'list';

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, isLoading, fetchListings } = useListingStore();
  
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const game = searchParams.get('game');
    const category = searchParams.get('category');
    
    if (game) setSelectedGames([game]);
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    fetchListings({ status: 'active' });
  }, [fetchListings]);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (selectedGames.length > 0) {
      result = result.filter(l => selectedGames.includes(l.game));
    }

    if (selectedCategory) {
      result = result.filter(l => l.category === selectedCategory);
    }

    if (minPrice) {
      result = result.filter(l => l.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(l => l.price <= parseFloat(maxPrice));
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [listings, selectedGames, selectedCategory, minPrice, maxPrice, sortBy]);

  const updateURL = (games: string[], category: string) => {
    const params = new URLSearchParams();
    if (games.length > 0) params.set('game', games[0]);
    if (category) params.set('category', category);
    setSearchParams(params, { replace: true });
  };

  const toggleGame = (game: string) => {
    const newGames = selectedGames.includes(game)
      ? selectedGames.filter(g => g !== game)
      : [...selectedGames, game];
    setSelectedGames(newGames);
    updateURL(newGames, selectedCategory);
  };

  const selectCategory = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    updateURL(selectedGames, newCategory);
  };

  const clearFilters = () => {
    setSelectedGames([]);
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({}, { replace: true });
  };

  const activeFilterCount = selectedGames.length + (selectedCategory ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const sortOptions = [
    { value: 'newest', label: 'En Yeni', icon: Clock },
    { value: 'oldest', label: 'En Eski', icon: Clock },
    { value: 'price-asc', label: 'En Ucuz', icon: TrendingUp },
    { value: 'price-desc', label: 'En Pahalı', icon: TrendingDown },
  ];

  const getSEOTitle = () => {
    if (selectedGames.length > 0 && selectedCategory) {
      return `${selectedGames[0]} ${selectedCategory} İlanları`;
    }
    if (selectedGames.length > 0) {
      return `${selectedGames[0]} İlanları`;
    }
    if (selectedCategory) {
      return `${selectedCategory} İlanları`;
    }
    return 'Tüm İlanlar - Oyun Hesapları ve Itemler';
  };

  const getSEODescription = () => {
    if (selectedGames.length > 0 && selectedCategory) {
      return `${selectedGames[0]} ${selectedCategory.toLowerCase()} ilanları. En uygun fiyatlar, güvenli alışveriş ve anında teslimat ile Item Sepetim'de.`;
    }
    if (selectedGames.length > 0) {
      return `${selectedGames[0]} oyun hesapları ve itemleri. Güvenli alışveriş, en uygun fiyatlar ve anında teslimat.`;
    }
    return 'Tüm oyun hesapları ve item ilanları. Valorant, Mobile Legends, PUBG Mobile ve daha fazlası. Fiyat, kategori ve oyuna göre filtrele.';
  };

  return (
    <>
      <SEO
        title={getSEOTitle()}
        description={getSEODescription()}
        url={`/listings${searchParams.toString() ? '?' + searchParams.toString() : ''}`}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            <Link to="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">İlanlar</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Tüm İlanlar
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {filteredListings.length} ilan bulundu
            </p>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filtreler
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Filtreler</h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Temizle
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 mb-3">
                      Oyun
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {GAME_CATEGORIES.map((game: string) => (
                        <label
                          key={game}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedGames.includes(game)}
                              onChange={() => toggleGame(game)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 transition-all ${
                              selectedGames.includes(game)
                                ? 'bg-primary-600 border-primary-600'
                                : 'border-neutral-300 dark:border-neutral-700 group-hover:border-primary-400'
                            }`}>
                              {selectedGames.includes(game) && (
                                <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">
                            {game}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 mb-3">
                      Kategori
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Hesap', 'Item'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => selectCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === cat
                              ? 'bg-primary-600 text-white shadow-float'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 mb-3">
                      Fiyat Aralığı
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 block">Min</label>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            className="input text-sm py-2"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1 block">Max</label>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="∞"
                            className="input text-sm py-2"
                          />
                        </div>
                      </div>
                      <div className="relative h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                        <div className="absolute h-full bg-primary-600 rounded-full" style={{ left: '10%', right: '10%' }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-600 rounded-full border-2 border-white dark:border-neutral-900 shadow" style={{ left: '10%' }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-600 rounded-full border-2 border-white dark:border-neutral-900 shadow" style={{ right: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    {sortOptions.find(s => s.value === sortBy)?.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-float-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden z-20"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as SortOption);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                              sortBy === option.value
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium'
                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedGames.map((game) => (
                    <span
                      key={game}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      {game}
                      <button
                        onClick={() => toggleGame(game)}
                        className="hover:text-primary-900 dark:hover:text-primary-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {selectedCategory && (
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full text-sm font-medium"
                    >
                      <Tag className="w-4 h-4" />
                      {selectedCategory}
                      <button
                        onClick={() => selectCategory(selectedCategory)}
                        className="hover:text-accent-900 dark:hover:text-accent-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 rounded-full text-sm font-medium"
                    >
                      {minPrice && `₺${minPrice}`} - {maxPrice && `${maxPrice}`}
                      <button
                        onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                        className="hover:text-success-900 dark:hover:text-success-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {isLoading && (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {!isLoading && filteredListings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-12 text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6">
                    <Search className="w-10 h-10 text-neutral-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                    İlan Bulunamadı
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Seçtiğin filtrelere uygun ilan yok. Filtreleri değiştirmeyi dene.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                </motion.div>
              )}

              {!isLoading && filteredListings.length > 0 && (
                <motion.div
                  layout
                  className={viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'
                    : 'space-y-4'
                  }
                >
                  <AnimatePresence>
                    {filteredListings.map((listing) => (
                      viewMode === 'grid' ? (
                        <ListingCard key={listing.id} listing={listing} />
                      ) : (
                        <ListingListCard key={listing.id} listing={listing} />
                      )
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-neutral-900 p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Filtreler</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">Oyun</h4>
                    <div className="space-y-2">
                      {GAME_CATEGORIES.map((game: string) => (
                        <label
                          key={game}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGames.includes(game)}
                            onChange={() => toggleGame(game)}
                            className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{game}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">Kategori</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Hesap', 'Item'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => selectCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === cat
                              ? 'bg-primary-600 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">Fiyat Aralığı</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="input text-sm"
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="input text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-neutral-900 p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
                  <button
                    onClick={() => { clearFilters(); setIsMobileFilterOpen(false); }}
                    className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Uygula
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function ListingListCard({ listing }: { listing: Listing }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card overflow-hidden group cursor-pointer"
    >
      <Link to={`/listings/${listing.id}`} className="flex flex-col sm:flex-row">
        <div className="sm:w-64 h-48 sm:h-auto bg-gradient-to-br from-primary-100 to-primary-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden flex-shrink-0">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-16 h-16 text-primary-400/50" />
            </div>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-bold">
                {listing.game}
              </span>
              <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold">
                {listing.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {listing.title}
            </h3>

            <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">
              {listing.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-sm text-neutral-500 dark:text-neutral-500">
              {new Date(listing.created_at).toLocaleDateString('tr-TR')}
            </span>
            <div className="text-2xl font-black text-gradient">
              {formatPrice(listing.price)}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
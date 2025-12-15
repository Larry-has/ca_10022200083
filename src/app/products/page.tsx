'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { productsAPI } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  brand: string;
  stock: number;
  images: { url: string; isPrimary?: boolean }[];
  averageRating?: number;
  numReviews?: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await productsAPI.getAll({
          page,
          limit: 12,
          category: category || undefined,
          sort,
          search: search || undefined,
        });
        setProducts(data.data.products);
        setTotal(data.data.pagination.total);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, category, sort, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category ? category : 'All Products'}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Search
          </button>
        </form>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-averageRating">Top Rated</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setCategory('');
                  setPage(1);
                }}
                className={`block w-full text-left px-3 py-2 rounded ${
                  category === '' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    category === cat ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <p className="text-gray-600 mb-4">{total} products found</p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {total > 12 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

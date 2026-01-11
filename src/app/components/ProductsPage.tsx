import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [category, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryParam = category !== 'all' ? `category=${category}` : '';
      const searchQuery = searchParams.get('search') || '';
      const searchParam = searchQuery ? `search=${searchQuery}` : '';
      const params = [categoryParam, searchParam].filter(Boolean).join('&');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7d057e1e/products${params ? `?${params}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      
      // Sort products
      let sorted = [...data];
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'popular') {
        sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }
      
      setProducts(sorted);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'Shop All Products'}
          </h1>
          <p className="text-gray-600">Discover our dreamy collection of soft girl essentials</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-pink-500" />
            <span className="font-medium">Filter:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'scrunchies', 'lipgloss', 'bows', 'accessories'].map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                onClick={() => setCategory(cat)}
                className={category === cat ? 'bg-pink-500 hover:bg-pink-600' : 'border-pink-200'}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <div className="ml-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <Button onClick={() => setCategory('all')} className="bg-pink-500 hover:bg-pink-600">
              View All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

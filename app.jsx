import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';

const API_URL = 'https://api.sheetbest.com/sheets/aba461f9-f680-4184-96a7-1a1405627cac';

export default function InventoryViewer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    divisi: '',
    kategori: '',
    supplier: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = products.map(p => p[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  const filteredProducts = products.filter(product => {
    // Search filter (Barcode and Nama Produk)
    const searchMatch = searchTerm === '' || 
      (product.BARCODE && product.BARCODE.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product['NAMA PRODUK'] && product['NAMA PRODUK'].toLowerCase().includes(searchTerm.toLowerCase()));

    // Divisi filter
    const divisiMatch = filters.divisi === '' || product.DIVISI === filters.divisi;

    // Kategori filter
    const kategoriMatch = filters.kategori === '' || product.KATEGORI === filters.kategori;

    // Supplier filter
    const supplierMatch = filters.supplier === '' || product.SUPPLIER === filters.supplier;

    return searchMatch && divisiMatch && kategoriMatch && supplierMatch;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      divisi: '',
      kategori: '',
      supplier: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Inventory Viewer</h1>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Barcode or Nama Produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="w-4 h-4 inline mr-1" />
                Divisi
              </label>
              <select
                value={filters.divisi}
                onChange={(e) => setFilters({...filters, divisi: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Divisi</option>
                {getUniqueValues('DIVISI').map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="w-4 h-4 inline mr-1" />
                Kategori
              </label>
              <select
                value={filters.kategori}
                onChange={(e) => setFilters({...filters, kategori: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Kategori</option>
                {getUniqueValues('KATEGORI').map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="w-4 h-4 inline mr-1" />
                Supplier
              </label>
              <select
                value={filters.supplier}
                onChange={(e) => setFilters({...filters, supplier: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Suppliers</option>
                {getUniqueValues('SUPPLIER').map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Barcode</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">H. Beli</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">H. Jual</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Margin</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Divisi</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Departemen</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subkategori</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qty Terjual</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qty/Bulan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qty/Hari</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stok</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ITO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="15" className="px-4 py-8 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{product.BARCODE}</td>
                      <td className="px-4 py-3 text-sm">{product['NAMA PRODUK']}</td>
                      <td className="px-4 py-3 text-sm">{product.HBELI}</td>
                      <td className="px-4 py-3 text-sm">{product.HJUAL}</td>
                      <td className="px-4 py-3 text-sm">{product.MARGIN}</td>
                      <td className="px-4 py-3 text-sm">{product.DIVISI}</td>
                      <td className="px-4 py-3 text-sm">{product.DEPARTEMEN}</td>
                      <td className="px-4 py-3 text-sm">{product.KATEGORI}</td>
                      <td className="px-4 py-3 text-sm">{product.SUBKATEGORI}</td>
                      <td className="px-4 py-3 text-sm">{product.SUPPLIER}</td>
                      <td className="px-4 py-3 text-sm">{product['QTY TERJUAL']}</td>
                      <td className="px-4 py-3 text-sm">{product['QTY TERJUAL PERBULAN']}</td>
                      <td className="px-4 py-3 text-sm">{product['QTY TERJUAL  PERHARI']}</td>
                      <td className="px-4 py-3 text-sm">{product.STOK}</td>
                      <td className="px-4 py-3 text-sm">{product.ITO}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
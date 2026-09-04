import { useState, useEffect, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  getPaginationRowModel 
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useCartStore from '../store/cartStore';
import ProductDetailDrawer from '../components/catalogue/ProductDetailDrawer';

const CataloguePage = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [brickFilter, setBrickFilter] = useState('');
  
  // Meta data
  const [meta, setMeta] = useState({ grades: [], bricks: [], categories: [] });

  // Drawer
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Selection
  const [rowSelection, setRowSelection] = useState({});

  const { addToCart, fetchCart, cart } = useCartStore();

  useEffect(() => {
    fetchCart();
    // Fetch Meta
    api.get('/products/meta').then(res => setMeta(res.data));
  }, [fetchCart]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page,
          limit,
          search,
          grade: gradeFilter,
          brick: brickFilter
        }).toString();
        
        const res = await api.get(`/products?${query}`);
        setData(res.data.products);
        setTotalCount(res.data.total);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [page, limit, search, gradeFilter, brickFilter]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    setSelectedProduct(null); // Close drawer
  };

  const handleBulkAddToCart = async () => {
    const selectedIds = Object.keys(rowSelection).map(index => data[index]._id);
    for (const id of selectedIds) {
      // For real app, ideally backend supports bulk add, doing sequential here
      await addToCart(id);
    }
    setRowSelection({});
  };

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-border text-primary focus:ring-primary/50"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-border text-primary focus:ring-primary/50"
        />
      ),
    },
    {
      accessorKey: 'title',
      header: 'Product',
      cell: info => <span className="font-medium">{info.getValue()}</span>
    },
    {
      accessorKey: 'brick',
      header: 'Brick',
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: info => info.getValue() ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {info.getValue()}
        </span>
      ) : '-'
    },
    {
      accessorKey: 'sizes',
      header: 'Available Sizes',
      cell: info => {
        const sizes = info.getValue() || [];
        return <span className="text-muted text-sm">{sizes.slice(0, 3).join(', ')}{sizes.length > 3 ? '...' : ''}</span>
      }
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    // We are doing manual server-side pagination, but tanstack needs to know total rows
    pageCount: Math.ceil(totalCount / limit),
    manualPagination: true,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Catalogue</h1>
        <p className="text-muted">Browse and select products from your uploaded catalogue.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-rounded absolute left-3 top-2.5 text-muted">search</span>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select 
          value={gradeFilter}
          onChange={e => setGradeFilter(e.target.value)}
          className="input-field md:w-48"
        >
          <option value="">All Grades</option>
          {meta.grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select 
          value={brickFilter}
          onChange={e => setBrickFilter(e.target.value)}
          className="input-field md:w-48"
        >
          <option value="">All Bricks</option>
          {meta.bricks.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="flex-1 glass-panel overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface/50 border-b border-border sticky top-0 backdrop-blur-md z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 font-medium text-muted uppercase tracking-wider text-xs">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-muted/20 rounded w-4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted/20 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted/20 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted/20 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted/20 rounded w-32"></div></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">
                    No products match your filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-surface-glass transition-colors cursor-pointer group"
                    onClick={(e) => {
                      if (e.target.type !== 'checkbox') setSelectedProduct(row.original);
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50">
          <span className="text-sm text-muted">
            Showing {Math.min((page - 1) * limit + 1, totalCount)} to {Math.min(page * limit, totalCount)} of {totalCount}
          </span>
          <div className="flex gap-2">
            <button 
              className="btn-secondary px-3 py-1 text-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button 
              className="btn-secondary px-3 py-1 text-sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(totalCount / limit)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Floating Toolbar */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel shadow-lg border-primary/20 bg-surface/90 flex items-center gap-4 px-6 py-3 rounded-full"
            >
              <span className="font-medium text-primary">{selectedCount} products selected</span>
              <div className="h-6 w-px bg-border"></div>
              <button onClick={() => setRowSelection({})} className="text-sm text-muted hover:text-foreground transition-colors">
                Clear
              </button>
              <button onClick={handleBulkAddToCart} className="btn-primary py-1.5 text-sm rounded-full flex items-center gap-2">
                <span className="material-symbols-rounded text-sm">add_shopping_cart</span>
                Add to Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProductDetailDrawer 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default CataloguePage;

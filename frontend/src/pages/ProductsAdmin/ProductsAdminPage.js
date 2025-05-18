import { useEffect, useState } from 'react';
import classes from './productsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/productService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // mặc định 10 item/trang
  const [totalPages, setTotalPages] = useState(1);

  const { searchTerm } = useParams();

  // Reset trang khi đổi limit hoặc search term
  useEffect(() => {
    setPage(1);
  }, [limit, searchTerm]);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, page, limit]);

  const loadProducts = async () => {
    const response = searchTerm
      ? await search(searchTerm, page, limit)
      : await getAll(page, limit);

    setProducts(response.data);
    setTotalPages(response.totalPages);
  };

  const deleteProduct = async product => {
    const confirmed = window.confirm(`Delete Product ${product.name}?`);
    if (!confirmed) return;

    await deleteById(product.id);
    toast.success(`"${product.name}" Has Been Removed!`);
    setProducts(prev => prev.filter(f => f.id !== product.id));
  };

  const ProductsNotFound = () => {
    if (products && products.length > 0) return null;

    return searchTerm ? (
      <NotFound linkRoute="/admin/products" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Manage Products" margin="1rem auto" />
        <Search
          searchRoute="/admin/products/"
          defaultRoute="/admin/products"
          margin="1rem 0"
          placeholder="Search Products"
        />

        <div className={classes.controls}>
          <Link to="/admin/addProduct" className={classes.add_product}>
            Add Products +
          </Link>

          {/* Dropdown chọn số lượng hiển thị */}
          <div className={classes.limit_selector}>
            <label htmlFor="limit">Show:</label>
            <select id="limit" value={limit} onChange={e => setLimit(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <ProductsNotFound />

        {products.map(product => (
          <div key={product.id} className={classes.list_item}>
            <img src={product.imageUrls[0]} alt={product.name} />
            <Link to={'/product/' + product.id}>{product.name}</Link>
            <Price price={product.price} />
            <div className={classes.actions}>
              <Link to={'/admin/editProduct/' + product.id}>Edit</Link>
              <Link onClick={() => deleteProduct(product)}>Delete</Link>
            </div>
          </div>
        ))}

        {/* PHÂN TRANG */}
        {totalPages >= 1 && (
          <div className={classes.pagination}>
            <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}>
              ‹
            </button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

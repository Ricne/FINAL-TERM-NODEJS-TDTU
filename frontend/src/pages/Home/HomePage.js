import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import classes from './homePage.module.css';

import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/productService';
import NotFound from '../../components/NotFound/NotFound';

const initialState = {
  products: [],
  tags: [],
  totalPages: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'PRODUCTS_LOADED':
      return {
        ...state,
        products: action.payload.data,
        totalPages: action.payload.totalPages,
      };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { products, tags, totalPages } = state;
  const { searchTerm, tag } = useParams();

  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    getAllTags().then(tags =>
      dispatch({ type: 'TAGS_LOADED', payload: tags })
    );
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      let res;
      if (tag) {
        res = await getAllByTag(tag, page, limit);
      } else if (searchTerm) {
        res = await search(searchTerm, page, limit);
      } else {
        res = await getAll(page, limit);
      }

      dispatch({ type: 'PRODUCTS_LOADED', payload: res });
    };

    loadProducts();
  }, [searchTerm, tag, page]);

  return (
    <>
      <Search />
      <Tags tags={tags} />

      {products.length === 0 ? (
        <NotFound linkText="Reset Search" />
      ) : (
        <>
          <Thumbnails products={products} />

          {/* PHÂN TRANG - Luôn hiển thị kể cả khi totalPages = 1 */}
          <div className={classes.pagination} >
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              style={{ marginRight: '10px' }}
            >
              ‹
            </button>
            <span>Trang {page} / {totalPages}</span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              style={{ marginLeft: '10px' }}
            >
              ›
            </button>
          </div>
            <br></br>

        </>
      )}
    </>
  );
}

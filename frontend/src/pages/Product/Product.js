import React, { useEffect, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import NotFound from '../../components/NotFound/NotFound';
import classes from './product.module.css';

import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/productService';

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
        products: Array.isArray(action.payload.data) ? action.payload.data : [],
        totalPages: action.payload.totalPages || 1,
      };
    case 'TAGS_LOADED':
      return {
        ...state,
        tags: Array.isArray(action.payload) ? action.payload : [],
      };
    default:
      return state;
  }
};

export default function Product() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { products, tags, totalPages } = state;

  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag');
  const searchTerm = searchParams.get('searchTerm');

  const [page, setPage] = useState(1);
  const limit = 8;

  // Load tags
  useEffect(() => {
    getAllTags()
      .then(tags => {
        dispatch({ type: 'TAGS_LOADED', payload: tags });
      })
      .catch(err => {
        console.error('Failed to load tags:', err);
        dispatch({ type: 'TAGS_LOADED', payload: [] });
      });
  }, []);

  // Load products based on tag / search / default
  useEffect(() => {
    const loadProducts = async () => {
      try {
        let res;
        if (tag) {
          res = await getAllByTag(tag, page, limit);
        } else if (searchTerm) {
          res = await search(searchTerm, page, limit);
        } else {
          res = await getAll(page, limit);
        }

        dispatch({ type: 'PRODUCTS_LOADED', payload: res });
      } catch (err) {
        console.error('Failed to load products:', err);
        dispatch({ type: 'PRODUCTS_LOADED', payload: { data: [], totalPages: 1 } });
      }
    };

    loadProducts();
  }, [tag, searchTerm, page]);

  return (
    <>
      <Search />
      <Tags tags={tags} />

      {!products || products.length === 0 ? (
        <NotFound linkText="Reset Search" />
      ) : (
        <>
          <Thumbnails products={products} />

          <div className={classes.pagination}>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              style={{ marginRight: '10px' }}
            >
              ‹
            </button>
            <span>Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              style={{ marginLeft: '10px' }}
            >
              ›
            </button>
          </div>
          <br />
        </>
      )}
    </>
  );
}

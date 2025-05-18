import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './hooks/useAuth';
import CartProvider from './hooks/useCart';
import { LoadingProvider } from './hooks/useLoading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Loading from './components/Loading/Loading';
import { useLoading } from './hooks/useLoading';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor';
import { useEffect } from 'react';
import { useCart } from './hooks/useCart';
import Footer from './components/Footer/Footer';

function AppContent() {
  const { showLoading, hideLoading } = useLoading();
  const { clearCart } = useCart();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, [showLoading, hideLoading]);

  return (
    <AuthProvider clearCart={clearCart}>
      <Loading />
      <Header />
      <AppRoutes />
      <Footer />
    </AuthProvider>
  );
}

function App() {
  return (
    <LoadingProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </LoadingProvider>
  );
}

export default App;

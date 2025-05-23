import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import '@fontsource/montserrat';
import theme from './theme';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './security/authContext';
import PrivateRoute from './components/PrivateRoute';
import AllGamesPage from './pages/AllGamesPage';
import AdminPanel from './pages/AdminPanel';
import { Navigate } from 'react-router-dom';
import EditGamePage from './pages/EditGamePage';
import EditCategoryPage from './pages/EditCategoryPage';
import EditPlatformPage from './pages/EditPlatformPage';
import GameDetailsPage from './pages/GameDetailsPage';
import { CartProvider } from './components/CartContext';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AddressManagementPage from './pages/AddressManagementPage';

function AppContent() {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          isAuthenticated && userRole === 'ADMIN'
            ? <AdminPanel />
            : <Navigate to="/" />
        }
      />
      <Route
        path="/games/edit/:id"
         element={
         isAuthenticated && userRole === 'ADMIN'
          ? <EditGamePage />
          : <Navigate to="/" />
          }
        />

       <Route path="/categories/edit/:id" element={ isAuthenticated && userRole === 'ADMIN'
        ? <EditCategoryPage /> : <Navigate to="/" />} />

       <Route path="/platforms/edit/:id" element={ isAuthenticated && userRole === 'ADMIN'
               ? <EditPlatformPage /> : <Navigate to="/" />} />

       <Route path="/profile" element={ isAuthenticated
               ? <ProfilePage /> : <Navigate to="/" />} />

       <Route path="/checkout" element={ isAuthenticated
               ? <CheckoutPage /> : <Navigate to="/" />} />

       <Route path="/orders/:id" element={ isAuthenticated
               ? <OrderDetailsPage /> : <Navigate to="/" />} />

        <Route path="/addresses" element={ isAuthenticated
               ? <AddressManagementPage /> : <Navigate to="/" />} />

      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/games" element={<AllGamesPage />} />
      <Route path="/games/:id" element={<GameDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <CartProvider>
     <AuthProvider>
       <ThemeProvider theme={theme}>
         <CssBaseline />
         <Router>
           <AppContent />
         </Router>
       </ThemeProvider>
     </AuthProvider>
    </CartProvider>
  );
}

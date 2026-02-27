import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { ProductDetail } from './pages/ProductDetail';
import { Register } from './pages/Register/Register';
import { Login } from './pages/Login/Login';
import { Checkout } from './pages/Checkout/Checkout';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { AdminRoute } from './components/ProtectedRoute/AdminRoute';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* Protected: logged-in users only */}
        <Route path="checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />

        <Route path="*" element={<div style={{ padding: '100px', textAlign: 'center' }}><h1>404 Not Found</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;

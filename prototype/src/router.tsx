import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/products/:slug', element: <ProductPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order/:orderNumber', element: <OrderConfirmationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

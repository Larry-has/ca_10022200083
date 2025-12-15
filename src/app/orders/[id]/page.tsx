'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ordersAPI, paymentsAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  items: {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    landmark?: string;
    gpsAddress?: string;
  };
  payment: {
    method: string;
    status: string;
  };
  itemsTotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  statusHistory: { status: string; timestamp: string }[];
  estimatedDelivery: string;
  createdAt: string;
}

function OrderDetailContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isPaymentSuccess = searchParams.get('payment') === 'success';
  const reference = searchParams.get('reference');
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { clearCart } = useCart();

  const fetchOrder = useCallback(async () => {
    try {
      const { data } = await ordersAPI.getById(id as string);
      setOrder(data.data.order);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const verifyPayment = useCallback(async (ref: string) => {
    setVerifying(true);
    try {
      const { data } = await paymentsAPI.verify(ref);
      if (data.success && data.data.status === 'success') {
        setPaymentVerified(true);
        await clearCart();
        toast.success('Payment successful!');
        fetchOrder();
      } else {
        toast.error('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      toast.error('Could not verify payment');
    } finally {
      setVerifying(false);
    }
  }, [clearCart, fetchOrder]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  useEffect(() => {
    if (reference && !paymentVerified) {
      verifyPayment(reference);
    }
  }, [reference, paymentVerified, verifyPayment]);

  const handlePayNow = async () => {
    if (!order) return;
    setVerifying(true);
    try {
      const { data } = await paymentsAPI.initialize(order._id);
      window.location.href = data.data.authorization_url;
    } catch {
      toast.error('Failed to initialize payment');
      setVerifying(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      {verifying && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
          <p className="text-blue-800">Verifying payment...</p>
        </div>
      )}

      {(isSuccess || paymentVerified || isPaymentSuccess) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">
              {paymentVerified || isPaymentSuccess ? 'Payment Successful!' : 'Order Placed Successfully!'}
            </p>
            <p className="text-green-700">Thank you for your order.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
            order.status === 'delivered'
              ? 'bg-green-100 text-green-800'
              : order.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {order.status}
        </span>
      </div>

      {order.status !== 'cancelled' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            {[
              { icon: Package, label: 'Confirmed' },
              { icon: Package, label: 'Processing' },
              { icon: Truck, label: 'Shipped' },
              { icon: Home, label: 'Delivered' },
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-sm mt-2">{step.label}</span>
              </div>
            ))}
          </div>
          {order.estimatedDelivery && (
            <p className="text-center text-gray-600 mt-4">
              Estimated Delivery: {formatDate(order.estimatedDelivery)}
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.region}
            </p>
            <p>{order.shippingAddress.phone}</p>
            {order.shippingAddress.landmark && (
              <p className="text-gray-600">Landmark: {order.shippingAddress.landmark}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Payment Info</h2>
            <p className="capitalize">Method: {order.payment.method.replace('_', ' ')}</p>
            <p className="capitalize">
              Status:{' '}
              <span
                className={
                  order.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }
              >
                {order.payment.status}
              </span>
            </p>
            {order.payment.status === 'pending' && order.payment.method !== 'cash_on_delivery' && (
              <Button
                onClick={handlePayNow}
                loading={verifying}
                className="w-full mt-4"
              >
                Pay Now with Paystack
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/orders" className="text-green-600 hover:underline">
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">Loading order...</div>
      </div>
    }>
      <OrderDetailContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI, paymentsAPI } from '@/lib/api';
import { formatCurrency, GHANA_REGIONS } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    region: '',
    landmark: '',
    gpsAddress: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const shippingCost = deliveryMethod === 'express' ? 50 : deliveryMethod === 'pickup' ? 0 : 20;
  const total = cart.totalPrice + shippingCost;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Create the order first
      const { data } = await ordersAPI.create({
        shippingAddress,
        paymentMethod,
        deliveryMethod,
      });

      const order = data.data.order;

      // If cash on delivery, just redirect to success
      if (paymentMethod === 'cash_on_delivery') {
        await clearCart();
        toast.success('Order placed successfully!');
        router.push(`/orders/${order._id}?success=true`);
        return;
      }

      // For mobile_money and card, use Paystack
      try {
        const paymentResponse = await paymentsAPI.initialize(order._id);
        const { authorization_url } = paymentResponse.data.data;

        // Redirect to Paystack checkout
        window.location.href = authorization_url;
      } catch {
        toast.error('Payment initialization failed. You can pay later from your orders page.');
        router.push(`/orders/${order._id}`);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
            <span className={`ml-2 ${step >= s ? 'text-green-600' : 'text-gray-400'}`}>
              {s === 1 && 'Shipping'}
              {s === 2 && 'Payment'}
              {s === 3 && 'Review'}
            </span>
            {s < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone Number"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                  }
                  required
                />
                <div className="col-span-2">
                  <Input
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    required
                  />
                </div>
                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <select
                    value={shippingAddress.region}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, region: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Region</option>
                    {GHANA_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Landmark (Optional)"
                  value={shippingAddress.landmark}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, landmark: e.target.value })
                  }
                />
                <Input
                  label="GPS Address (Optional)"
                  placeholder="e.g., GA-123-4567"
                  value={shippingAddress.gpsAddress}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, gpsAddress: e.target.value })
                  }
                />
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Delivery Method</h3>
              <div className="space-y-2">
                {[
                  { id: 'standard', name: 'Standard Delivery', price: 20, days: '3-5 days' },
                  { id: 'express', name: 'Express Delivery', price: 50, days: '1-2 days' },
                  { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Same day' },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                      deliveryMethod === option.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === option.id}
                        onChange={() => setDeliveryMethod(option.id)}
                        className="text-green-600"
                      />
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-gray-500">{option.days}</p>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {option.price === 0 ? 'Free' : formatCurrency(option.price)}
                    </span>
                  </label>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full mt-6"
                disabled={
                  !shippingAddress.fullName ||
                  !shippingAddress.phone ||
                  !shippingAddress.street ||
                  !shippingAddress.city ||
                  !shippingAddress.region
                }
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  {
                    id: 'mobile_money',
                    name: 'Mobile Money',
                    desc: 'MTN MoMo, Vodafone Cash, AirtelTigo Money',
                  },
                  { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Mastercard' },
                  {
                    id: 'cash_on_delivery',
                    name: 'Cash on Delivery',
                    desc: 'Pay when you receive',
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${
                      paymentMethod === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="text-green-600"
                    />
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {(paymentMethod === 'mobile_money' || paymentMethod === 'card') && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">
                    Secure payment powered by Paystack
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    You will be redirected to Paystack to complete your payment securely.
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Review Your Order</h2>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.street}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.region}
                </p>
                <p>{shippingAddress.phone}</p>
                {shippingAddress.landmark && <p>Landmark: {shippingAddress.landmark}</p>}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="capitalize">{paymentMethod.replace('_', ' ')}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Order Items</h3>
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex justify-between py-2">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handlePlaceOrder} loading={loading} className="flex-1">
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(shippingCost)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

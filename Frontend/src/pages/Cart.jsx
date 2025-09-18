// frontend/src/pages/Cart.jsx
import React, { useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { TbLoader3 } from "react-icons/tb";

const Cart = () => {
    // CORRECTED: Added updateCartQuantity to the destructuring
    const { cart, getCart, removeFromCart, updateCartQuantity, isFetchingCart } = useProductStore();

    useEffect(() => {
        getCart();
    }, [getCart]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            if (item && item.productId) {
                return total + item.productId.price * item.quantity;
            }
            return total;
        }, 0);
    };
    
    const formattedTotal = new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR',
    }).format(calculateTotal());

    if (isFetchingCart) {
        return (
            <div className='flex justify-center items-center h-screen bg-gray-900'>
                <TbLoader3 className='animate-spin size-20 text-emerald-500' />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 pt-24 mt-16">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12">Your Shopping Cart</h1>
                
                {cart.length === 0 ? (
                    <div className="text-center text-gray-400 bg-gray-800 p-10 rounded-lg">
                        <h2 className="text-2xl font-bold mb-2">Your cart is empty.</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className="text-emerald-400 hover:underline mt-4 inline-block font-semibold">
                          &larr; Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.filter(item => item.productId).map(item => (
                                <div key={item.productId._id} className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md">
                                    <img src={item.productId.image} alt={item.productId.name} className="w-24 h-24 object-cover rounded-md mr-4"/>
                                    <div className="flex-grow">
                                        <h2 className="text-lg font-bold">{item.productId.name}</h2>
                                        
                                        {/* CORRECTED: The quantity editor is now correctly placed here */}
                                        <div className="flex items-center mt-2">
                                            <label htmlFor={`quantity-${item.productId._id}`} className="text-sm mr-2 text-gray-400">Qty:</label>
                                            <input
                                                id={`quantity-${item.productId._id}`}
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateCartQuantity(item.productId._id, parseInt(e.target.value))}
                                                className="w-16 bg-gray-700 border border-gray-600 rounded-md p-1 text-center"
                                            />
                                        </div>

                                        <p className="text-emerald-400 font-semibold mt-1">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.productId.price)}
                                        </p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.productId._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Order Summary Section */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-md sticky top-24">
                            <h2 className="text-2xl font-bold border-b border-gray-700 pb-4 mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formattedTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">FREE</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-4 mt-4">
                                <span>Total Price</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <button className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
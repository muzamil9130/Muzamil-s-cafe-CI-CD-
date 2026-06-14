import { useState } from 'react';
import { MenuItem, CartItem } from '../types';
import { ShoppingBag, X, Plus, Minus, Trash2, Receipt, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAddItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onDecrementItem: (id: string) => void;
}

export default function OrderCart({
  isOpen,
  onClose,
  cartItems,
  onAddItem,
  onRemoveItem,
  onClearCart,
  onDecrementItem
}: OrderCartProps) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    ticketNumber: string;
    items: { name: string; qty: number; price: number }[];
    subtotal: number;
    tax: number;
    gratuity: number;
    total: number;
    timestamp: string;
  } | null>(null);

  // Math totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% State Tax
  const gratuity = subtotal > 0 ? subtotal * 0.10 : 0; // 10% Service Charge
  const total = subtotal + tax + gratuity;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Trigger placed order & generate receipt
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    // Generate unique random receipt metadata
    const randomTicket = 'MUZ-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const orderPayload = {
      ticketNumber: randomTicket,
      items: cartItems.map(c => ({
        name: c.menuItem.name,
        quantity: c.quantity,
        price: c.menuItem.price
      })),
      subtotal,
      tax,
      gratuity,
      total
    };

    // Post order to MongoDB API
    const postOrderToBackend = async () => {
      try {
        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      } catch (err) {
        console.warn('Backend server down. Order not saved to database.');
      }
    };

    postOrderToBackend();

    setReceiptData({
      ticketNumber: randomTicket,
      items: cartItems.map(c => ({
        name: c.menuItem.name,
        qty: c.quantity,
        price: c.menuItem.price
      })),
      subtotal,
      tax,
      gratuity,
      total,
      timestamp: dateStr
    });

    setIsReceiptModalOpen(true);
  };

  const handleFinishCheckout = () => {
    setIsReceiptModalOpen(false);
    setReceiptData(null);
    onClearCart();
    onClose();
  };

  return (
    <>
      {/* Slide-out Cart Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-stone-950/65 z-55 backdrop-blur-xs"
              id="cart-backdrop"
            />

            {/* Custom Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-stone-50 shadow-2xl z-60 border-l border-stone-200 flex flex-col justify-between"
              id="cart-drawer-container"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-stone-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={20} className="text-amber-800" />
                  <h3 className="text-xl font-serif font-medium text-stone-900">Your Gourmet Order</h3>
                  <span className="bg-amber-100 text-amber-800 font-mono text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalQuantity}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-stone-100 rounded-full text-stone-500 hover:text-stone-950 transition"
                  id="close-cart-drawer-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body - Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-3 bg-white hover:bg-stone-100/50 rounded-xl border border-stone-200/60 transition"
                      id={`cart-item-${item.menuItem.id}`}
                      key={item.menuItem.id}
                    >
                      {/* Round tiny cover */}
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      {/* Info & Quantity controller */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="text-sm font-medium font-serif text-stone-900 line-clamp-1">
                              {item.menuItem.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.menuItem.id)}
                              className="text-stone-400 hover:text-red-600 transition shrink-0 p-1"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <p className="text-xs font-mono font-medium text-amber-800 mt-0.5">
                            Rs. {item.menuItem.price.toLocaleString()} each
                          </p>
                        </div>

                        {/* Plus and minus handles */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                          <span className="text-slate-400 text-[10px] uppercase font-mono font-semibold tracking-wider">
                            Qty Selection
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDecrementItem(item.menuItem.id)}
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 transition"
                              id={`cart-minus-${item.menuItem.id}`}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-mono text-xs font-bold text-stone-900 min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onAddItem(item.menuItem.id)}
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950 transition"
                              id={`cart-plus-${item.menuItem.id}`}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 px-4" id="empty-cart-state">
                    <ShoppingBag size={48} className="text-stone-300 mb-4 stroke-[1.5]" />
                    <h4 className="font-serif text-lg font-medium text-stone-800 mb-1">Your order is empty</h4>
                    <p className="text-stone-500 text-xs font-light max-w-xs">
                      Browse our delicacies catalog and add exquisite plates or drinks to begin your culinary dining reservation.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-medium transition"
                    >
                      Return to Menu
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer - Price breakdown & submit */}
              {cartItems.length > 0 && (
                <div className="bg-white border-t border-stone-200 p-6 space-y-4">
                  {/* Detailed rates */}
                  <div className="space-y-2 font-light text-stone-600 text-xs">
                    <div className="flex justify-between">
                      <span>Plates Subtotal</span>
                      <span className="font-mono text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bistro State Tax (8%)</span>
                      <span className="font-mono text-stone-900">Rs. {tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Gratuity (10%)</span>
                      <span className="font-mono text-stone-900">Rs. {gratuity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-stone-100 walk font-medium text-sm text-stone-900">
                      <span className="font-serif">Grand Total</span>
                      <span className="font-mono text-amber-800 font-bold text-base">
                        Rs. {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-4.5 bg-amber-700 hover:bg-amber-800 text-stone-50 font-medium rounded-lg text-sm flex items-center justify-center gap-2 shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
                    id="cart-checkout-btn"
                  >
                    <Receipt size={16} />
                    <span>Confirm Kitchen Order</span>
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Retro Print Receipt Modal Overlay */}
      <AnimatePresence>
        {isReceiptModalOpen && receiptData && (
          <div className="fixed inset-0 bg-stone-950/75 z-70 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs" id="receipt-modal">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 relative text-stone-900 text-left font-mono border-4 border-double border-stone-200"
            >
              {/* Decorative paper trim at top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-repeat-x flex" style={{ backgroundImage: "linear-gradient(135deg, transparent 50%, #fff 50%), linear-gradient(-135deg, transparent 50%, #fff 50%)", backgroundSize: "12px 12px" }}>
                <div className="w-full h-1 bg-stone-200 border-b border-dashed border-stone-400"></div>
              </div>

              <div className="pt-4 flex flex-col items-center">
                <Printer size={28} className="text-stone-500 mb-2 stroke-[1.5]" />
                <h4 className="text-base font-bold uppercase tracking-wider text-center">CAFE MUZAMIL</h4>
                <p className="text-[10px] text-stone-400 text-center uppercase tracking-tight mt-0.5">
                  M2, Block K, Gulberg II, Lahore, Pakistan
                </p>
                <p className="text-[10px] text-stone-400 text-center tracking-tight">
                  Tel: 03323222680
                </p>
              </div>

              {/* Receipt divider */}
              <div className="border-b border-dashed border-stone-300 my-4"></div>

              {/* Info Block */}
              <div className="text-[11px] text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>TICKET NO:</span>
                  <span className="font-bold text-stone-900">{receiptData.ticketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{receiptData.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>TABLE CAPTAIN:</span>
                  <span>Muzamil A.</span>
                </div>
                <div className="flex justify-between">
                  <span>ORDER STATUS:</span>
                  <span className="bg-green-100 text-green-800 font-bold px-1.5 rounded uppercase text-[9px] animate-pulse">
                    KITCHEN SENT
                  </span>
                </div>
              </div>

              {/* Receipt divider */}
              <div className="border-b border-dashed border-stone-300 my-4"></div>

              {/* Items Breakdown list */}
              <div className="text-[12px] space-y-3">
                <div className="flex justify-between font-bold text-xs text-stone-500">
                  <span>ITEM DESCRIPTION</span>
                  <span className="ml-auto">QTY</span>
                  <span className="w-16 text-right">PRICE</span>
                </div>
                {receiptData.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-start text-stone-800 font-medium">
                    <span className="max-w-[180px] break-words">{it.name}</span>
                    <span className="ml-auto font-bold">{it.qty}</span>
                    <span className="w-16 text-right">Rs. {(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Receipt divider */}
              <div className="border-b border-dashed border-stone-300 my-4"></div>

              {/* Totals section */}
              <div className="text-[11px] text-stone-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>Rs. {receiptData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT SALES TAX (8%)</span>
                  <span>Rs. {receiptData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>BISTRO GRATUITY (10%)</span>
                  <span>Rs. {receiptData.gratuity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-dashed border-stone-300 text-sm text-stone-950 font-bold">
                  <span>TOTAL PAID</span>
                  <span>Rs. {receiptData.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-b border-dashed border-stone-300 my-4"></div>

              {/* Artistic Barcode scan simulation */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="h-8 w-44 bg-repeat-x flex justify-between overflow-hidden" style={{ backgroundImage: "linear-gradient(90deg, #18181b 0%, #18181b 20%, transparent 20%, transparent 40%, #18181b 40%, #18181b 50%, transparent 50%, transparent 60%, #18181b 60%, #18181b 80%, transparent 80%, transparent 90%, #18181b 90%, #18181b 100%)", backgroundSize: "10px 100%" }}></div>
                <span className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">
                  **{receiptData.ticketNumber}**
                </span>
              </div>

              {/* Thank you statement */}
              <div className="text-center text-[10px] text-stone-500 font-light mt-4 space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <Sparkles size={10} className="text-amber-500" />
                  <span>Shukriya for dining with us!</span>
                  <Sparkles size={10} className="text-amber-500" />
                </p>
                <p>Present this ticket at the check-out desk.</p>
              </div>

              {/* Close receipt overlay */}
              <button
                onClick={handleFinishCheckout}
                className="mt-6 w-full py-3 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-50 font-bold text-xs uppercase tracking-widest rounded-md hover:shadow-md transition"
                id="receipt-done-btn"
              >
                Assemble New Order
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

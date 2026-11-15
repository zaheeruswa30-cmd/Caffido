import { useState, type FormEvent } from 'react';
import { CheckCircle2, ExternalLink, Minus, Plus, Trash2, X } from 'lucide-react';
import { CAFE_INFO, type MenuItem } from '../data/caffido';

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

type FulfillmentMode = 'Takeout' | 'Dine-in' | 'Delivery';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entries: CartEntry[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onClearCart: () => void;
}

export function OrderDrawer({
  isOpen,
  onClose,
  entries,
  onUpdateQty,
  onClearCart,
}: OrderDrawerProps) {
  const [mode, setMode] = useState<FulfillmentMode>('Takeout');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);

  if (!isOpen) return null;

  const subtotal = entries.reduce(
    (sum, entry) => sum + entry.item.pricePkr * entry.quantity,
    0
  );

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = customerName.trim();
    const cleanedPhone = customerPhone.replace(/\s+/g, '');

    if (trimmedName.length < 2) {
      setFormError('Please enter your name so our baristas know who to prepare for.');
      return;
    }
    if (!/^(\+92|0)?3\d{9}$/.test(cleanedPhone)) {
      setFormError('Enter a valid Pakistani mobile number (e.g., 0336 2223431).');
      return;
    }

    setFormError('');
    const orderNum = `CFD-${Math.floor(1020 + Math.random() * 8900)}`;
    setConfirmedTotal(subtotal);
    setConfirmedOrderId(orderNum);
    onClearCart();
  };

  const handleResetAfterConfirm = () => {
    setConfirmedOrderId(null);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Your Caffido Order Bag"
    >
      <div
        className="fixed inset-0 bg-[#181614]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="relative w-full max-w-md bg-[#FAF9F6] text-[#181614] h-full flex flex-col border-l border-[#181614]/10 shadow-2xl">
        <div className="px-6 py-5 border-b border-[#181614]/10 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#181614]">
              Your Caffido Order
            </h2>
            <p className="text-xs text-[#5E5952] mt-0.5">
              Shop W-13, Eastern Pride · Open until 2:00 AM
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order drawer"
            className="w-10 h-10 rounded-lg inline-flex items-center justify-center text-[#524E48] hover:text-[#181614] hover:bg-[#EFECE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {confirmedOrderId ? (
            <div className="py-8 space-y-5">
              <div className="inline-flex items-center gap-2 text-[#234234] font-medium text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Order Request Confirmed</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#181614]">
                Order #{confirmedOrderId}
              </h3>
              <p className="text-sm text-[#524E48] leading-relaxed">
                Thank you, {customerName}. We have logged your{' '}
                <span className="font-medium text-[#181614]">{mode}</span>{' '}
                request totaling{' '}
                <span className="font-semibold text-[#181614] tabular-nums">
                  Rs {confirmedTotal.toLocaleString()}
                </span>
                . For instant counter updates or changes, call or WhatsApp us at{' '}
                <a
                  href={CAFE_INFO.phoneHref}
                  className="underline underline-offset-2 text-[#234234] font-medium"
                >
                  {CAFE_INFO.phone}
                </a>
                .
              </p>

              <div className="p-4 rounded-lg bg-[#EFECE6] text-xs text-[#524E48] space-y-1.5">
                <div className="font-medium text-[#181614]">Pickup &amp; Dine-in Counter</div>
                <div>{CAFE_INFO.addressLine1}</div>
                <div>{CAFE_INFO.addressLine2}</div>
              </div>

              <button
                type="button"
                onClick={handleResetAfterConfirm}
                className="w-full py-2.5 px-4 rounded-lg bg-[#234234] text-[#FAF9F6] text-sm font-medium hover:bg-[#193025] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <p className="font-display text-lg font-medium text-[#181614]">
                Your order bag is empty
              </p>
              <p className="text-sm text-[#5E5952] max-w-xs mx-auto leading-relaxed">
                Add drinks, bagels, croissants, or brownies from the menu to prepare a takeout pickup or dine-in table order.
              </p>
              <div className="pt-2 flex flex-col gap-2.5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-lg bg-[#234234] text-[#FAF9F6] text-sm font-medium hover:bg-[#193025] transition-colors cursor-pointer"
                >
                  Browse Menu
                </button>
                <a
                  href={CAFE_INFO.foodpandaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg border border-[#181614]/15 text-sm font-medium text-[#181614] hover:bg-[#EFECE6] transition-colors"
                >
                  <span>Order Delivery on foodpanda</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Fulfillment Switch */}
              <div>
                <div className="text-xs font-medium text-[#5E5952] mb-2">
                  Service preference
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFECE6] rounded-lg">
                  {(['Takeout', 'Dine-in', 'Delivery'] as FulfillmentMode[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMode(option)}
                      className={`py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        mode === option
                          ? 'bg-[#FAF9F6] text-[#181614] shadow-xs'
                          : 'text-[#524E48] hover:text-[#181614]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Itemized list */}
              <ul className="divide-y divide-[#181614]/10">
                {entries.map(({ item, quantity }) => (
                  <li key={item.id} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#181614]">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#5E5952] mt-0.5 tabular-nums">
                        Rs {item.pricePkr.toLocaleString()} each
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-8 h-8 rounded-md border border-[#181614]/15 inline-flex items-center justify-center text-[#181614] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                      >
                        {quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-[#7A3528]" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="w-6 text-center text-sm font-medium tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-8 h-8 rounded-md border border-[#181614]/15 inline-flex items-center justify-center text-[#181614] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {mode === 'Delivery' ? (
                <div className="p-4 rounded-lg bg-[#EFECE6] space-y-3">
                  <p className="text-xs text-[#524E48] leading-relaxed">
                    Doorstep delivery across Gulistan-e-Johar &amp; Karachi is fulfilled via foodpanda or direct courier coordination by phone.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={CAFE_INFO.foodpandaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#234234] text-[#FAF9F6] text-sm font-medium hover:bg-[#193025] transition-colors"
                    >
                      <span>Continue to foodpanda.pk</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={CAFE_INFO.phoneHref}
                      className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg border border-[#181614]/15 text-xs font-medium text-[#181614] hover:bg-[#FAF9F6] transition-colors"
                    >
                      Or call {CAFE_INFO.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-3.5 pt-2 border-t border-[#181614]/10">
                  <div>
                    <label htmlFor="order-name" className="block text-xs font-medium text-[#524E48] mb-1">
                      Your Name
                    </label>
                    <input
                      id="order-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g., Fatima"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#181614]/15 rounded-lg focus:outline-none focus:border-[#234234]"
                    />
                  </div>
                  <div>
                    <label htmlFor="order-phone" className="block text-xs font-medium text-[#524E48] mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="order-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0336 2223431"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#181614]/15 rounded-lg tabular-nums focus:outline-none focus:border-[#234234]"
                    />
                  </div>
                  <div>
                    <label htmlFor="order-notes" className="block text-xs font-medium text-[#524E48] mb-1">
                      Notes (optional)
                    </label>
                    <input
                      id="order-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Less ice, warm brownie, table near window..."
                      className="w-full px-3 py-2 text-sm bg-white border border-[#181614]/15 rounded-lg focus:outline-none focus:border-[#234234]"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs text-[#9E2A2B] font-medium" role="alert">
                      {formError}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-sm">
                    <span className="text-[#524E48]">Estimated Total (Pay at Counter)</span>
                    <span className="font-semibold text-[#181614] tabular-nums">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#234234] text-[#FAF9F6] text-sm font-medium hover:bg-[#193025] transition-colors cursor-pointer"
                  >
                    Confirm {mode} Order
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

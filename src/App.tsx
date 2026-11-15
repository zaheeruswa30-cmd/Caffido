import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MapPin,
  Minus,
  Phone,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { OrderDrawer, type CartEntry } from './components/OrderDrawer';
import { ResilientImage } from './components/ResilientImage';
import {
  CAFE_INFO,
  MENU_CATEGORIES,
  MENU_ITEMS,
  POPULAR_TIMES_BY_DAY,
  REVIEWS,
  type MenuCategory,
  type MenuItem,
} from './data/caffido';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Popular times day selector
  const dayKeys = Object.keys(POPULAR_TIMES_BY_DAY);
  const [selectedDay, setSelectedDay] = useState<string>(dayKeys[0]);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number>(3);

  // Copy address state
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Table reservation form state
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resGuests, setResGuests] = useState('2 Guests');
  const [resTime, setResTime] = useState('9:00 PM');
  const [resError, setResError] = useState('');
  const [resConfirmed, setResConfirmed] = useState<{
    code: string;
    name: string;
    guests: string;
    time: string;
  } | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartEntries: CartEntry[] = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => {
        const item = MENU_ITEMS.find((m) => m.id === id);
        return item ? { item, quantity } : null;
      })
      .filter((entry): entry is CartEntry => entry !== null);
  }, [cart]);

  const totalCartCount = useMemo(
    () => cartEntries.reduce((acc, entry) => acc + entry.quantity, 0),
    [cartEntries]
  );

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      const nextQty = Math.max(0, (prev[itemId] ?? 0) + delta);
      if (nextQty === 0) {
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: nextQty };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CAFE_INFO.fullAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    } catch {
      setCopiedAddress(false);
    }
  };

  const handleReserveSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = resName.trim();
    const cleanedPhone = resPhone.replace(/\s+/g, '');

    if (trimmedName.length < 2) {
      setResError('Please enter your name for the table booking.');
      return;
    }
    if (!/^(\+92|0)?3\d{9}$/.test(cleanedPhone)) {
      setResError('Enter a valid mobile number (e.g., 0336 2223431).');
      return;
    }

    setResError('');
    setResConfirmed({
      code: `TBL-${Math.floor(210 + Math.random() * 780)}`,
      name: trimmedName,
      guests: resGuests,
      time: resTime,
    });
  };

  const activeSlots = POPULAR_TIMES_BY_DAY[selectedDay] ?? [];
  const activeSlotInfo = activeSlots[hoveredSlotIndex] ?? activeSlots[0];

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#181614]">
      <Navbar cartCount={totalCartCount} onOpenCart={() => setDrawerOpen(true)} />

      <main className="flex-1">
        {/* 1. HERO SPLIT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center py-2">
              <p className="text-xs font-medium text-[#5E5952] tracking-wide mb-4">
                Shop W-13, Eastern Pride · Block 15 Gulistan-e-Johar, Karachi
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4vw,3.65rem)] font-semibold leading-[1.08] tracking-tight text-[#181614] text-balance">
                Aesthetic coffee &amp; late-night bites in Johar.
              </h1>

              <p className="mt-5 text-base text-[#524E48] leading-relaxed max-w-xl">
                Designed for calm solo coffee breaks and unhurried evening gatherings. Stop by for ceremonial mango matcha, single-origin espresso, toasted chicken cheese bagels, and warm fudge brownies until 2:00 AM.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#234234] text-[#FAF9F6] text-sm font-medium hover:bg-[#193025] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234234]"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={CAFE_INFO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-lg border border-[#181614]/15 text-sm font-medium text-[#181614] hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
                >
                  <MapPin className="w-4 h-4 text-[#234234]" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]">
              <div className="w-full h-full rounded-xl overflow-hidden border border-[#181614]/10 bg-[#EFECE6]">
                <ResilientImage
                  src={CAFE_INFO.heroImage}
                  alt="Inside Caffido coffee shop in Gulistan-e-Johar with warm ambient pendant lights, oak tables, espresso bar, and greenery"
                  fallbackTitle="Caffido · Eastern Pride, Block 15"
                  className="w-full h-full lg:h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Key Fact Strip below hero split */}
          <div className="mt-10 pt-8 border-t border-[#181614]/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-[#5E5952]">Google Rating</div>
              <div className="mt-1 font-display text-xl font-semibold text-[#181614] tabular-nums">
                4.7 / 5.0
              </div>
              <div className="mt-0.5 text-xs text-[#524E48] tabular-nums">
                Based on {CAFE_INFO.reviewCount} verified reviews
              </div>
            </div>

            <div>
              <div className="text-xs text-[#5E5952]">Opening Hours</div>
              <div className="mt-1 font-display text-xl font-semibold text-[#181614] tabular-nums">
                Open until 2:00 AM
              </div>
              <div className="mt-0.5 text-xs text-[#524E48]">
                Daily dine-in &amp; late-night coffee
              </div>
            </div>

            <div>
              <div className="text-xs text-[#5E5952]">Average Spend</div>
              <div className="mt-1 font-display text-xl font-semibold text-[#181614] tabular-nums">
                Rs 1–2,000
              </div>
              <div className="mt-0.5 text-xs text-[#524E48]">
                Per person · Quality worth the price
              </div>
            </div>

            <div>
              <div className="text-xs text-[#5E5952]">Service Options</div>
              <div className="mt-1 font-display text-xl font-semibold text-[#181614]">
                Dine-in &amp; Takeout
              </div>
              <div className="mt-0.5 text-xs text-[#524E48]">
                Plus local delivery on foodpanda.pk
              </div>
            </div>
          </div>
        </section>

        {/* 2. MENU SHOWCASE */}
        <section
          id="menu"
          className="border-t border-[#181614]/10 bg-[#F4F2ED]/60 py-14 lg:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-medium text-[#234234]">
                  Crafted Fresh to Order
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#181614] text-balance">
                  The Caffido Menu
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#524E48] max-w-xl">
                  From layered mango matcha and iced lattes to toasted bagels, flaky croissants, and warm fudge brownies.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="w-4 h-4 text-[#5E5952] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drinks, bagels, brownie..."
                  aria-label="Search Caffido menu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-[#181614]/15 rounded-lg text-[#181614] placeholder:text-[#787269] focus:outline-none focus:border-[#234234]"
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Menu categories"
              className="mt-8 flex items-center gap-1.5 overflow-x-auto pb-1"
            >
              {MENU_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#234234] text-[#FAF9F6]'
                        : 'bg-[#FAF9F6] text-[#524E48] border border-[#181614]/10 hover:text-[#181614] hover:border-[#181614]/25'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Uniform 3-Column Menu Grid */}
            {filteredItems.length === 0 ? (
              <div className="mt-10 py-14 text-center border border-[#181614]/10 rounded-xl bg-[#FAF9F6]">
                <p className="font-display text-lg font-medium text-[#181614]">
                  No menu items match &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="mt-1 text-sm text-[#5E5952]">
                  Try clearing your search or switching back to all categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-[#234234] text-[#FAF9F6] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredItems.map((item: MenuItem) => {
                  const qty = cart[item.id] ?? 0;
                  return (
                    <article
                      key={item.id}
                      className="flex flex-col bg-[#FAF9F6] rounded-xl border border-[#181614]/10 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFECE6]">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          fallbackTitle={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        {/* Unboxed clean metadata */}
                        <div className="flex items-center gap-2 text-xs text-[#5E5952]">
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.prepTime}</span>
                          {item.highlightNote && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#234234] font-medium">
                                {item.highlightNote}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-2 font-display text-lg font-semibold text-[#181614]">
                          {item.name}
                        </h3>

                        <p className="mt-1.5 text-sm text-[#524E48] leading-relaxed flex-1">
                          {item.description}
                        </p>

                        <div className="mt-5 pt-4 border-t border-[#181614]/10 flex items-center justify-between gap-4">
                          <span className="text-base font-semibold text-[#181614] tabular-nums">
                            Rs {item.pricePkr.toLocaleString()}
                          </span>

                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, 1)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#181614]/15 bg-white text-xs font-medium text-[#181614] hover:border-[#234234] hover:bg-[#234234] hover:text-[#FAF9F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Order</span>
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2 bg-[#EFECE6] rounded-lg p-1">
                              <button
                                type="button"
                                aria-label={`Remove one ${item.name}`}
                                onClick={() => handleUpdateQty(item.id, -1)}
                                className="w-7 h-7 rounded-md bg-white text-[#181614] inline-flex items-center justify-center hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-semibold tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                aria-label={`Add one more ${item.name}`}
                                onClick={() => handleUpdateQty(item.id, 1)}
                                className="w-7 h-7 rounded-md bg-[#234234] text-[#FAF9F6] inline-flex items-center justify-center hover:bg-[#193025] transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 3. ATMOSPHERE, POPULAR TIMES & TABLE RESERVATION */}
        <section
          id="atmosphere"
          className="border-t border-[#181614]/10 py-14 lg:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: Peaceful space & interactive Popular Times */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="text-xs font-medium text-[#234234]">
                  Calm Atmosphere in Block 15
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#181614] text-balance">
                  A quiet corner for coffee breaks and small gatherings.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#524E48] leading-relaxed max-w-2xl">
                  Whether you are dropping by in the afternoon with a laptop or meeting friends over iced lattes and fudge brownies after dinner, Caffido keeps seating comfortable, lighting warm, and service attentive until 2:00 AM.
                </p>
              </div>

              {/* Interactive Popular Times viewer */}
              <div className="p-6 rounded-xl border border-[#181614]/10 bg-[#F4F2ED]/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#181614]">
                      Typical Visiting Hours
                    </h3>
                    <p className="text-xs text-[#5E5952] mt-0.5">
                      Select a day or hover a time bar to plan your visit
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 p-1 bg-[#E7E4DC] rounded-lg self-start">
                    {dayKeys.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          selectedDay === day
                            ? 'bg-[#FAF9F6] text-[#181614] shadow-xs'
                            : 'text-[#524E48] hover:text-[#181614]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-5 gap-3 items-end h-36 pt-4">
                  {activeSlots.map((slot, index) => {
                    const isFocused = index === hoveredSlotIndex;
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => setHoveredSlotIndex(index)}
                        onMouseEnter={() => setHoveredSlotIndex(index)}
                        className="group flex flex-col items-center justify-end h-full gap-2 cursor-pointer focus:outline-none"
                      >
                        <div className="w-full max-w-[44px] flex-1 flex items-end bg-[#E7E4DC]/60 rounded-md overflow-hidden">
                          <div
                            style={{ height: `${slot.level}%` }}
                            className={`w-full rounded-t-md transition-colors duration-150 ${
                              isFocused
                                ? 'bg-[#234234]'
                                : 'bg-[#8F8A80] group-hover:bg-[#4A4640]'
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs tabular-nums ${
                            isFocused
                              ? 'font-semibold text-[#181614]'
                              : 'text-[#5E5952]'
                          }`}
                        >
                          {slot.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeSlotInfo && (
                  <div className="mt-5 pt-4 border-t border-[#181614]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#181614] tabular-nums">
                      {selectedDay} at {activeSlotInfo.label} · {activeSlotInfo.level}% typical occupancy
                    </span>
                    <span className="text-[#524E48]">{activeSlotInfo.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Table Reservation for Small Gatherings */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-xl border border-[#181614]/10 bg-white">
              <h3 className="font-display text-2xl font-semibold text-[#181614]">
                Reserve a Table
              </h3>
              <p className="mt-1.5 text-sm text-[#524E48]">
                Planning a small gathering or late-night coffee meetup? Hold a table at Shop W-13, Eastern Pride.
              </p>

              {resConfirmed ? (
                <div className="mt-6 space-y-4 py-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-[#234234]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Table Held · Ref #{resConfirmed.code}</span>
                  </div>
                  <p className="text-sm text-[#524E48] leading-relaxed">
                    We have reserved seating for{' '}
                    <span className="font-medium text-[#181614]">
                      {resConfirmed.guests}
                    </span>{' '}
                    under{' '}
                    <span className="font-medium text-[#181614]">
                      {resConfirmed.name}
                    </span>{' '}
                    at{' '}
                    <span className="font-medium text-[#181614] tabular-nums">
                      {resConfirmed.time}
                    </span>
                    . Need to adjust headcount? Call us on{' '}
                    <a
                      href={CAFE_INFO.phoneHref}
                      className="underline text-[#234234] font-medium"
                    >
                      {CAFE_INFO.phone}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResConfirmed(null);
                      setResName('');
                      setResPhone('');
                    }}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-[#181614]/15 text-[#181614] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                  >
                    Make Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReserveSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="res-name"
                      className="block text-xs font-medium text-[#524E48] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="e.g., Saman Haseeb"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#181614]/15 rounded-lg focus:outline-none focus:border-[#234234]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="res-phone"
                      className="block text-xs font-medium text-[#524E48] mb-1.5"
                    >
                      Phone Number
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      value={resPhone}
                      onChange={(e) => setResPhone(e.target.value)}
                      placeholder="0336 2223431"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#181614]/15 rounded-lg tabular-nums focus:outline-none focus:border-[#234234]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="res-guests"
                        className="block text-xs font-medium text-[#524E48] mb-1.5"
                      >
                        Party Size
                      </label>
                      <select
                        id="res-guests"
                        value={resGuests}
                        onChange={(e) => setResGuests(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[#FAF9F6] border border-[#181614]/15 rounded-lg focus:outline-none focus:border-[#234234]"
                      >
                        <option>2 Guests</option>
                        <option>4 Guests</option>
                        <option>6 Guests</option>
                        <option>8+ Small Gathering</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="res-time"
                        className="block text-xs font-medium text-[#524E48] mb-1.5"
                      >
                        Arrival Time
                      </label>
                      <select
                        id="res-time"
                        value={resTime}
                        onChange={(e) => setResTime(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[#FAF9F6] border border-[#181614]/15 rounded-lg tabular-nums focus:outline-none focus:border-[#234234]"
                      >
                        <option>3:00 PM</option>
                        <option>6:00 PM</option>
                        <option>8:00 PM</option>
                        <option>9:00 PM</option>
                        <option>10:30 PM</option>
                        <option>12:00 AM</option>
                      </select>
                    </div>
                  </div>

                  {resError && (
                    <p className="text-xs font-medium text-[#9E2A2B]" role="alert">
                      {resError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-[#234234] text-[#FAF9F6] text-sm font-medium hover:bg-[#193025] transition-colors cursor-pointer"
                  >
                    Request Table Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 4. GUEST REVIEWS & VISIT CAFFIDO */}
        <section
          id="reviews"
          className="border-t border-[#181614]/10 bg-[#F4F2ED]/60 py-14 lg:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {/* Verified Google Reviews */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#234234]">
                    Google Local Guides
                  </p>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#181614]">
                    Loved across Gulistan-e-Johar
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#181614] tabular-nums">
                  <Star className="w-4 h-4 fill-[#234234] text-[#234234]" />
                  <span className="font-semibold">{CAFE_INFO.rating}</span>
                  <span className="text-[#5E5952]">
                    ({CAFE_INFO.reviewCount} reviews on Google)
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {REVIEWS.map((review) => (
                  <article
                    key={review.id}
                    className="p-6 rounded-xl bg-[#FAF9F6] border border-[#181614]/10 flex flex-col justify-between gap-5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#5E5952]">
                        <span>{review.badge}</span>
                        <span>{review.timeframe}</span>
                      </div>

                      <h3 className="mt-2 font-display text-lg font-semibold text-[#181614]">
                        {review.author}
                      </h3>

                      <p className="mt-3 text-sm text-[#524E48] leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#181614]/10">
                      <div className="text-xs text-[#5E5952]">
                        Tried: {review.orderedItems.join(' · ')}
                      </div>

                      {review.ownerReply && (
                        <div className="text-xs text-[#524E48] bg-[#EFECE6] px-3 py-2 rounded-md">
                          <span className="font-medium text-[#181614]">
                            Owner response:
                          </span>{' '}
                          {review.ownerReply.text}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Visit & Directions Block */}
            <div
              id="visit"
              className="p-6 sm:p-10 rounded-xl bg-[#181614] text-[#FAF9F6] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <p className="text-xs font-medium text-[#B7C9BE]">
                  Visit Us Tonight
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                  Find Caffido at Eastern Pride, Block 15
                </h2>
                <p className="text-sm sm:text-base text-[#D6D1C9] leading-relaxed max-w-xl">
                  {CAFE_INFO.fullAddress}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#B7B1A8] tabular-nums">
                  <span>Plus Code: {CAFE_INFO.plusCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{CAFE_INFO.hoursDetailed}</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={CAFE_INFO.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#FAF9F6] text-[#181614] text-sm font-medium hover:bg-[#EFECE6] transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4 text-[#234234]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={CAFE_INFO.phoneHref}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#FAF9F6]/20 text-xs sm:text-sm font-medium text-[#FAF9F6] hover:bg-[#FAF9F6]/10 transition-colors whitespace-nowrap tabular-nums"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{CAFE_INFO.phone}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#FAF9F6]/20 text-xs sm:text-sm font-medium text-[#FAF9F6] hover:bg-[#FAF9F6]/10 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-4 h-4 text-[#9FD0B3]" />
                        <span>Address Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={CAFE_INFO.foodpandaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-[#D6D1C9] hover:text-[#FAF9F6] underline underline-offset-4 pt-1"
                >
                  <span>Order Delivery on foodpanda.pk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="border-t border-[#181614]/10 bg-[#FAF9F6] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-display text-lg font-semibold text-[#181614]">
              Caffido
            </div>
            <p className="mt-1 text-xs text-[#5E5952]">
              Shop W-13, Eastern Pride · Block 15 Gulistan-e-Johar, Karachi · Open daily until 2:00 AM
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#524E48]">
            <a href="#menu" className="hover:text-[#181614] transition-colors">
              Menu
            </a>
            <a href="#atmosphere" className="hover:text-[#181614] transition-colors">
              Atmosphere
            </a>
            <a href="#reviews" className="hover:text-[#181614] transition-colors">
              Reviews
            </a>
            <a href={CAFE_INFO.phoneHref} className="hover:text-[#181614] transition-colors tabular-nums">
              {CAFE_INFO.phone}
            </a>
          </div>
        </div>
      </footer>

      <OrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entries={cartEntries}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

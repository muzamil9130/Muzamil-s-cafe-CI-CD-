import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { CalendarDays, Users, Flame, MapPin, Sparkles, Check, CheckCircle2, Ticket, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReservationForm() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Form input states
  const [guests, setGuests] = useState<number>(2);
  const [area, setArea] = useState<Reservation['area']>('main-hall');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('19:00');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [requests, setRequests] = useState<string>('');
  
  // UI states
  const [isSuccess, setIsSuccess] = useState(false);
  const [recentCode, setRecentCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing reservations from localStorage on mount
  // Load existing reservations from API (and fallback to localStorage if server is down)
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reservations');
        if (res.ok) {
          const data = await res.json();
          setReservations(data);
          return;
        }
      } catch (err) {
        console.warn('Backend server not reachable. Falling back to local storage.');
      }
      
      const saved = localStorage.getItem('lam_reservations');
      if (saved) {
        try {
          setReservations(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing reservations', e);
        }
      }
    };

    fetchReservations();

    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const timeSlots = {
    lunch: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'],
    dinner: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
  };

  const seatingAreas = [
    { value: 'main-hall', label: 'Grand Main Hall', desc: 'Candlelit dining amongst grand arches and live background cello.', icon: '🕯️' },
    { value: 'patio', label: 'Heated Outdoor Patio', desc: 'Lush evergreen flora, ambient space heaters, and charming string lights.', icon: '🌿' },
    { value: 'window-seat', label: 'Window Side', desc: 'Overlooking the quiet, cobblestone street for intimate couples.', icon: '🪟' },
    { value: 'bar', label: 'High-Seating Bar Lounge', desc: 'Casual proximity to our expert mixologists and copper spirits display.', icon: '🥃' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !phone || !date) {
      setErrorMsg('Please complete all contact details to secure your reservation.');
      return;
    }

    // Generate unique booking code
    const bookingCode = 'RES-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      guests,
      area,
      date,
      time,
      name,
      email,
      phone,
      specialRequests: requests,
      createdAt: new Date().toISOString(),
      reservationCode: bookingCode
    };

    const submitToBackend = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReservation)
        });
        if (res.ok) {
          const savedRes = await res.json();
          setReservations(prev => [savedRes, ...prev]);
          
          // Also sync to local storage backup
          const updated = [savedRes, ...reservations];
          localStorage.setItem('lam_reservations', JSON.stringify(updated));
          return;
        }
      } catch (err) {
        console.warn('Backend server down. Saving to local storage only.');
      }

      // Fallback: local storage
      const updated = [newReservation, ...reservations];
      localStorage.setItem('lam_reservations', JSON.stringify(updated));
      setReservations(updated);
    };

    submitToBackend();
    
    setRecentCode(bookingCode);
    setIsSuccess(true);

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setRequests('');
  };

  const handleDelete = async (id: string) => {
    try {
      const target = reservations.find(r => r.id === id || (r as any)._id === id);
      const deleteId = target ? ((target as any)._id || target.id) : id;

      await fetch(`http://localhost:5000/api/reservations/${deleteId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Backend server down. Removing from local state only.');
    }

    const filtered = reservations.filter(res => res.id !== id && (res as any)._id !== id);
    localStorage.setItem('lam_reservations', JSON.stringify(filtered));
    setReservations(filtered);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-stone-900 text-stone-150 border-t border-stone-850" id="reservations-section">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-400 rounded-full text-xs font-medium font-mono uppercase tracking-wider mb-3">
            <CalendarDays size={13} />
            <span>Secure Seating</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-4">
            Table Reservations
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto font-light">
            Due to our intimate scale and detailed kitchen prep, tables are limited. Join us for lunch or dinner by submitting your requests below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Reservation Booking Form (Left Column, col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-stone-950 p-6 md:p-10 rounded-2xl border border-stone-800 shadow-xl"
          >
            <h3 className="text-xl font-serif font-semibold text-amber-50 mb-6 flex items-center gap-2">
              <span>Select Seating Specifications</span>
            </h3>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-4 flex flex-col items-center bg-stone-900/60 rounded-xl border border-amber-500/20"
                id="booking-success-indicator"
              >
                <CheckCircle2 size={48} className="text-amber-500 mb-4 stroke-[1.5]" />
                <h4 className="text-2xl font-serif text-amber-100 mb-2">Reservation Accomplished!</h4>
                <p className="text-stone-300 text-sm font-light max-w-md leading-relaxed mb-6">
                  We have allocated a table for you at <span className="text-white font-medium">Cafe Muzamil</span>. A confirmation details package has been dispatched to your email coordinates.
                </p>
                <div className="p-4 bg-stone-950/80 rounded-lg border border-stone-800 font-mono text-center w-full max-w-xs mb-8">
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest block mb-1">
                    Booking Reference Code
                  </span>
                  <span className="text-2xl font-bold tracking-widest text-amber-400">
                    {recentCode}
                  </span>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-stone-50 font-medium rounded-lg text-xs tracking-wider uppercase transition"
                >
                  Book Another Table
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" id="table-booking-form">
                
                {/* 1. Companions count */}
                <div>
                  <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-3">
                    Guest count index: <span className="text-white font-medium">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 8].map(qty => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setGuests(qty)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-mono transition-all ${
                          guests === qty
                            ? 'bg-amber-700 text-white font-bold'
                            : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
                        }`}
                        id={`btn-guest-${qty}`}
                      >
                        {qty === 8 ? '8+' : qty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Seating Zone Card Selectors */}
                <div>
                  <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-3">
                    Preferred Dining Environment
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {seatingAreas.map(sz => (
                      <div
                        key={sz.value}
                        onClick={() => setArea(sz.value as any)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          area === sz.value
                            ? 'bg-amber-900/20 border-amber-600/70 text-white'
                            : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-900'
                        }`}
                        id={`seat-zone-${sz.value}`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-medium text-sm text-stone-100 flex items-center gap-1.5">
                            <span className="text-base">{sz.icon}</span>
                            <span>{sz.label}</span>
                          </span>
                          {area === sz.value && (
                            <span className="h-4 w-4 rounded-full bg-amber-600 flex items-center justify-center text-[10px]">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                          {sz.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Date & Time picks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                      Calendar Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="input-res-date"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                      Scheduled Timing Slot
                    </label>
                    <select
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      id="select-res-time"
                    >
                      <optgroup label="Lunch (Matinée)">
                        {timeSlots.lunch.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Dinner (Soirée)">
                        {timeSlots.dinner.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* 4. Guest Contact Detail inputs */}
                <div className="space-y-4 pt-4 border-t border-stone-800/80">
                  <h4 className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Contact Coordinates
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        id="input-res-name"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email coordinates"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        id="input-res-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Coordinates"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        id="input-res-phone"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Allergies, Dietary, Celebrations..."
                        value={requests}
                        onChange={e => setRequests(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        id="input-res-requests"
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
                )}

                {/* Final Booking dispatch */}
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-stone-50 font-medium rounded-lg text-sm select-none transition shadow"
                  id="submit-reservation-btn"
                >
                  Request Dining Reservation Ticket
                </button>
              </form>
            )}
          </motion.div>

          {/* Reserved Tix Display (Right Column, col-span-5) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800">
              <h4 className="text-sm font-mono text-stone-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                <span>Active Table Tickets</span>
                <span className="bg-stone-900 text-stone-300 px-2 py-0.5 rounded text-[10px] font-bold">
                  {reservations.length} total
                </span>
              </h4>

              <AnimatePresence mode="popLayout">
                {reservations.length > 0 ? (
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1" id="reservations-tickets-list">
                    {reservations.map((res) => {
                      const areaLabel = seatingAreas.find(s => s.value === res.area)?.label || res.area;
                      const formattedDate = new Date(res.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      });
                      
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-5 flex flex-col justify-between hover:border-amber-700/25 transition"
                          id={`ticket-card-${res.id}`}
                          key={res.id}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-serif text-base font-bold text-white block">
                                {formattedDate}
                              </span>
                              <span className="font-mono text-xs text-amber-500 font-medium">
                                at {res.time} • {res.guests} {res.guests === 1 ? 'seat' : 'seats'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDelete(res.id)}
                              className="p-1.5 rounded-md hover:bg-red-950/40 text-stone-500 hover:text-red-400 transition"
                              title="Cancel Ticket"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="space-y-1.5 text-xs text-stone-300 font-light border-t border-stone-800 pt-3">
                            <p className="flex justify-between">
                              <span className="text-stone-500">Holder:</span>
                              <span className="font-medium text-stone-100">{res.name}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-stone-500">Zone:</span>
                              <span className="font-medium text-stone-200">{areaLabel}</span>
                            </p>
                            {res.specialRequests && (
                              <p className="flex justify-between">
                                <span className="text-stone-500">Note:</span>
                                <span className="text-stone-300 italic truncate max-w-[180px]">"{res.specialRequests}"</span>
                              </p>
                            )}
                          </div>

                          {/* Decorative barcode layout */}
                          <div className="border-t border-dashed border-stone-800 mt-4 pt-3 flex items-center justify-between font-mono">
                            <span className="text-[10px] text-amber-700/80 tracking-widest font-bold">
                              {res.reservationCode}
                            </span>
                            <div className="flex gap-0.5">
                              <span className="w-0.5 h-4 bg-stone-700"></span>
                              <span className="w-1.5 h-4 bg-stone-700"></span>
                              <span className="w-0.5 h-4 bg-stone-700"></span>
                              <span className="w-1 h-4 bg-stone-700"></span>
                              <span className="w-0.5 h-4 bg-stone-700"></span>
                              <span className="w-2 h-4 bg-stone-700"></span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-stone-900/30 rounded-xl border border-dashed border-stone-800/80" id="tickets-empty-state">
                    <Ticket className="mx-auto text-stone-600 mb-3 stroke-[1.2]" size={28} />
                    <p className="text-stone-400 text-xs font-light">
                      No active bookings saved to your device cache yet. Use the scheduler form to reserve seats!
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Map info panel */}
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
              {/* Abs map marker texture */}
              <div className="absolute right-[-40px] bottom-[-20px] text-stone-900 opacity-20 pointer-events-none stroke-[0.5]">
                <MapPin size={180} />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-amber-500 tracking-wider font-semibold block mb-1">
                  Location & Timing specs
                </span>
                <h4 className="text-lg font-serif text-stone-100 mb-3">Cafe Muzamil</h4>
                <p className="text-stone-400 text-xs leading-relaxed font-light mb-4">
                  M2, Block K, Gulberg II, Lahore. Located near the central park for convenient access.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] font-mono border-t border-stone-900 pt-4">
                <div>
                  <span className="text-stone-500 uppercase">WEEKDAY ATTIRE</span>
                  <p className="text-stone-200 mt-0.5">Smart Casual</p>
                </div>
                <div>
                  <span className="text-stone-500 uppercase">VALET SERVICE</span>
                  <p className="text-stone-200 mt-0.5">Complimentary</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}

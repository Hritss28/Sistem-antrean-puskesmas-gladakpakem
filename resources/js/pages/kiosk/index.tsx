import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Polyclinic {
    id: number;
    name: string;
    queue_prefix: string;
    quota_per_day: number;
    remaining: number;
    icon: string;
}

interface Ticket {
    queue_number: string;
    queue_category: string;
    priority_reason: string | null;
    poly_name: string;
    payment_type: string;
    date: string;
    time: string;
    estimated_minutes: number;
    waiting_before: number;
}

interface KioskProps {
    polyclinics: Polyclinic[];
    puskesmasName: string;
    motto: string;
    flash?: { ticket?: Ticket };
}

type Step = 'category' | 'payment' | 'polyclinic' | 'priority_reason' | 'ticket';

export default function KioskPage() {
    const { polyclinics, puskesmasName, motto, flash } = usePage<{ props: KioskProps }>().props as unknown as KioskProps;
    const [step, setStep] = useState<Step>('category');
    const [category, setCategory] = useState<'prioritas' | 'umum' | ''>('');
    const [priorityReason, setPriorityReason] = useState<string>('');
    const [paymentType, setPaymentType] = useState<'bpjs' | 'umum' | ''>('');
    const [selectedPoly, setSelectedPoly] = useState<number | null>(null);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Check flash for ticket
    const pageProps = usePage().props as any;
    useEffect(() => {
        if (pageProps.flash?.ticket) {
            setTicket(pageProps.flash.ticket);
            setStep('ticket');
        }
    }, [pageProps.flash]);

    const handleCategorySelect = (cat: 'prioritas' | 'umum') => {
        setCategory(cat);
        if (cat === 'prioritas') {
            setStep('priority_reason');
        } else {
            setStep('payment');
        }
    };

    const handlePriorityReasonSelect = (reason: string) => {
        setPriorityReason(reason);
        setStep('payment');
    };

    const handlePaymentSelect = (type: 'bpjs' | 'umum') => {
        setPaymentType(type);
        setStep('polyclinic');
    };

    const handleSubmit = () => {
        if (!selectedPoly || !paymentType || !category) return;
        setLoading(true);

        router.post('/kiosk', {
            queue_category: category,
            priority_reason: category === 'prioritas' ? priorityReason : null,
            payment_type: paymentType,
            poly_id: selectedPoly,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flashData = (page.props as any).flash;
                if (flashData?.ticket) {
                    setTicket(flashData.ticket);
                    setStep('ticket');
                }
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    const resetAll = () => {
        setStep('category');
        setCategory('');
        setPriorityReason('');
        setPaymentType('');
        setSelectedPoly(null);
        setTicket(null);
    };

    const priorityReasons = [
        { id: 'lansia', label: 'Lansia (≥60 tahun)', icon: '👴' },
        { id: 'bumil', label: 'Ibu Hamil', icon: '🤰' },
        { id: 'disabilitas', label: 'Disabilitas', icon: '♿' },
        { id: 'balita', label: 'Balita', icon: '👶' },
    ];

    return (
        <>
            <Head title="Kiosk - Ambil Nomor Antrean" />
            <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 flex flex-col items-center justify-center p-4 md:p-8 select-none">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-5xl mb-2">🏥</div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">SELAMAT DATANG</h1>
                    <p className="text-xl text-teal-100 mt-1">di {puskesmasName}</p>
                    <p className="text-teal-200 italic text-sm">"{motto}"</p>
                    <p className="text-teal-200 text-xs mt-2">
                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {' • '}
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </p>
                </div>

                {/* Content */}
                <div className="w-full max-w-2xl">
                    {/* STEP: Category Selection */}
                    {step === 'category' && (
                        <div className="animate-in fade-in duration-300">
                            <StepHeader number={1} title="Pilih Kategori Pasien" />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <KioskButton
                                    onClick={() => handleCategorySelect('prioritas')}
                                    className="bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400"
                                >
                                    <span className="text-4xl">⭐</span>
                                    <span className="text-xl font-bold">PRIORITAS</span>
                                    <span className="text-sm opacity-80">Lansia • Ibu Hamil</span>
                                    <span className="text-sm opacity-80">Disabilitas • Balita</span>
                                </KioskButton>
                                <KioskButton
                                    onClick={() => handleCategorySelect('umum')}
                                    className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500"
                                >
                                    <span className="text-4xl">👤</span>
                                    <span className="text-xl font-bold">UMUM</span>
                                    <span className="text-sm opacity-80">Pasien Biasa</span>
                                </KioskButton>
                            </div>
                        </div>
                    )}

                    {/* STEP: Priority Reason */}
                    {step === 'priority_reason' && (
                        <div className="animate-in fade-in duration-300">
                            <StepHeader number={1} title="Pilih Alasan Prioritas" />
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {priorityReasons.map((reason) => (
                                    <KioskButton
                                        key={reason.id}
                                        onClick={() => handlePriorityReasonSelect(reason.id)}
                                        className="bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400"
                                    >
                                        <span className="text-3xl">{reason.icon}</span>
                                        <span className="text-base font-bold">{reason.label}</span>
                                    </KioskButton>
                                ))}
                            </div>
                            <button onClick={() => { setStep('category'); setCategory(''); }} className="mt-4 text-white/80 hover:text-white text-sm flex items-center gap-1 mx-auto">
                                ← Kembali
                            </button>
                        </div>
                    )}

                    {/* STEP: Payment Type */}
                    {step === 'payment' && (
                        <div className="animate-in fade-in duration-300">
                            <StepHeader number={2} title="Pilih Jenis Pembayaran" />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <KioskButton
                                    onClick={() => handlePaymentSelect('bpjs')}
                                    className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500"
                                >
                                    <span className="text-4xl">🟢</span>
                                    <span className="text-xl font-bold">BPJS</span>
                                    <span className="text-sm opacity-80">Peserta JKN</span>
                                </KioskButton>
                                <KioskButton
                                    onClick={() => handlePaymentSelect('umum')}
                                    className="bg-gradient-to-br from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500"
                                >
                                    <span className="text-4xl">🔵</span>
                                    <span className="text-xl font-bold">UMUM</span>
                                    <span className="text-sm opacity-80">Bayar Sendiri</span>
                                </KioskButton>
                            </div>
                            <button onClick={() => { setStep(category === 'prioritas' ? 'priority_reason' : 'category'); }} className="mt-4 text-white/80 hover:text-white text-sm flex items-center gap-1 mx-auto">
                                ← Kembali
                            </button>
                        </div>
                    )}

                    {/* STEP: Polyclinic Selection */}
                    {step === 'polyclinic' && (
                        <div className="animate-in fade-in duration-300">
                            <StepHeader number={3} title="Pilih Poli Tujuan" />
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {polyclinics.map((poly) => (
                                    <button
                                        key={poly.id}
                                        onClick={() => setSelectedPoly(poly.id)}
                                        disabled={poly.remaining === 0}
                                        className={`rounded-2xl p-4 text-center flex flex-col items-center gap-1 transition-all duration-200 ${
                                            selectedPoly === poly.id
                                                ? 'bg-white text-teal-800 ring-4 ring-teal-300 scale-105'
                                                : poly.remaining === 0
                                                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                                                : 'bg-white/30 text-white hover:bg-white/50 hover:scale-102 active:scale-95'
                                        }`}
                                    >
                                        <span className="text-3xl">{poly.icon}</span>
                                        <span className="font-bold text-sm">{poly.name}</span>
                                        <span className={`text-xs ${poly.remaining === 0 ? 'text-red-300' : ''}`}>
                                            {poly.remaining === 0 ? 'KUOTA HABIS' : `Sisa: ${poly.remaining}`}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {selectedPoly && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-bold text-lg py-4 rounded-2xl shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Memproses...' : '🎫 AMBIL NOMOR ANTREAN'}
                                </button>
                            )}
                            <button onClick={() => setStep('payment')} className="mt-3 text-white/80 hover:text-white text-sm flex items-center gap-1 mx-auto">
                                ← Kembali
                            </button>
                        </div>
                    )}

                    {/* STEP: Ticket Display */}
                    {step === 'ticket' && ticket && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl">
                                <h2 className="text-xl font-bold text-gray-600 mb-4">🎫 NOMOR ANTREAN ANDA</h2>

                                <div className={`rounded-2xl p-6 mb-4 ${ticket.queue_category === 'prioritas' ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                                    {ticket.queue_category === 'prioritas' && <span className="text-2xl">⭐</span>}
                                    <div className={`text-5xl md:text-6xl font-black mt-1 ${ticket.queue_category === 'prioritas' ? 'text-orange-600' : 'text-blue-600'}`}>
                                        {ticket.queue_number}
                                    </div>
                                    <div className={`text-sm font-semibold mt-1 uppercase ${ticket.queue_category === 'prioritas' ? 'text-orange-500' : 'text-blue-500'}`}>
                                        {ticket.queue_category}
                                        {ticket.priority_reason && ` — ${ticket.priority_reason}`}
                                    </div>
                                </div>

                                <div className="text-left space-y-2 text-sm">
                                    <InfoRow label="Poli" value={ticket.poly_name} />
                                    <InfoRow label="Bayar" value={ticket.payment_type.toUpperCase()} />
                                    <InfoRow label="Tanggal" value={ticket.date} />
                                    <InfoRow label="Jam" value={ticket.time} />
                                    <InfoRow label="Estimasi" value={`± ${ticket.estimated_minutes} menit`} />
                                    <InfoRow label="Sisa sebelum Anda" value={`${ticket.waiting_before} orang`} />
                                </div>

                                <p className="mt-4 text-gray-500 text-sm">
                                    Silakan tunggu di ruang tunggu dan perhatikan display antrean.
                                </p>

                                <button
                                    onClick={resetAll}
                                    className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
                                >
                                    🔄 Ambil Nomor Lagi
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-teal-200 text-xs mt-6">📞 Bantuan: (0331) 337772</p>
            </div>
        </>
    );
}

function StepHeader({ number, title }: { number: number; title: string }) {
    return (
        <div className="text-center">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                STEP {number}
            </span>
            <h2 className="text-xl font-bold text-white mt-2">{title}</h2>
        </div>
    );
}

function KioskButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-2xl p-6 text-white shadow-lg flex flex-col items-center gap-2 transition-all duration-200 active:scale-95 ${className}`}
        >
            {children}
        </button>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-100 pb-1">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
        </div>
    );
}

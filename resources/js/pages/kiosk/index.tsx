import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
    Hospital, Star, User, Baby, HeartPulse, Accessibility,
    CreditCard, Shield, Stethoscope, Syringe, Ambulance,
    ChevronLeft, Ticket, Clock, Users, MapPin,
    Printer, RefreshCw, Phone
} from 'lucide-react';

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
}

type Step = 'category' | 'payment' | 'polyclinic' | 'priority_reason' | 'ticket';

const polyIcons: Record<string, React.ReactNode> = {
    'POL-001': <Stethoscope className="w-8 h-8" />,
    'POL-002': <HeartPulse className="w-8 h-8" />,
    'POL-003': <Baby className="w-8 h-8" />,
    'POL-004': <Syringe className="w-8 h-8" />,
    'POL-005': <Ambulance className="w-8 h-8" />,
};

export default function KioskPage() {
    const { polyclinics, puskesmasName, motto } = usePage<{ props: KioskProps }>().props as unknown as KioskProps;
    const pageProps = usePage().props as any;

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

    useEffect(() => {
        if (pageProps.flash?.ticket) {
            setTicket(pageProps.flash.ticket);
            setStep('ticket');
        }
    }, [pageProps.flash]);

    const handleCategorySelect = (cat: 'prioritas' | 'umum') => {
        setCategory(cat);
        setStep(cat === 'prioritas' ? 'priority_reason' : 'payment');
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
                    Swal.fire({
                        icon: 'success',
                        title: 'Nomor Antrean Berhasil!',
                        html: `Nomor antrean Anda: <b class="text-2xl">${flashData.ticket.queue_number}</b>`,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#0d9488',
                        timer: 4000,
                        timerProgressBar: true,
                    });
                }
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
                Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan saat mengambil nomor antrean.', confirmButtonColor: '#0d9488' });
            },
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
        { id: 'lansia', label: 'Lansia (≥60 tahun)', sublabel: 'Usia lanjut', icon: <User className="w-7 h-7" /> },
        { id: 'bumil', label: 'Ibu Hamil', sublabel: 'Kehamilan', icon: <HeartPulse className="w-7 h-7" /> },
        { id: 'disabilitas', label: 'Disabilitas', sublabel: 'Keterbatasan fisik', icon: <Accessibility className="w-7 h-7" /> },
        { id: 'balita', label: 'Balita', sublabel: 'Usia 0-5 tahun', icon: <Baby className="w-7 h-7" /> },
    ];

    const getPolyIcon = (iconCode: string) => polyIcons[iconCode] || <Hospital className="w-8 h-8" />;

    return (
        <>
            <Head title="Kiosk - Ambil Nomor Antrean" />
            <div className="min-h-screen bg-white flex flex-col select-none overflow-hidden relative">
                {/* Hero Banner */}
                <div className="relative w-full overflow-hidden">
                    <img
                        src="/images/puskesmas-hero.png"
                        alt="Puskesmas Gladak Pakem"
                        className="w-full h-auto block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-white" />
                </div>

                {/* Logo + Header */}
                <div className="text-center -mt-14 relative z-10 px-4">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-white shadow-xl shadow-gray-200/50 border-4 border-white flex items-center justify-center overflow-hidden">
                        <img src="/images/logo-puskesmas.png" alt="Logo" className="w-16 h-16" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">SELAMAT DATANG</h1>
                    <p className="text-lg text-teal-600 mt-1 font-medium">di {puskesmasName}</p>
                    <p className="text-slate-400 italic text-sm mt-1">"{motto}"</p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-slate-400 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                            {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {' • '}
                            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center px-4 md:px-8 mt-6">
                    <div className="w-full max-w-2xl relative z-10">
                        {/* Step Progress */}
                        {step !== 'ticket' && (
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {['category', 'payment', 'polyclinic'].map((s, i) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${getStepIndex(step) >= i
                                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40'
                                            : 'bg-slate-200 text-slate-400'
                                            }`}>{i + 1}</div>
                                        {i < 2 && <div className={`w-8 h-0.5 transition-all duration-300 ${getStepIndex(step) > i ? 'bg-teal-500' : 'bg-slate-200'}`} />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* STEP: Category Selection */}
                        {step === 'category' && (
                            <div className="animate-fadeIn">
                                <StepTitle title="Pilih Kategori Pasien" />
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <GlassButton
                                        onClick={() => handleCategorySelect('prioritas')}
                                        gradient="from-amber-50 to-orange-50"
                                        border="border-amber-200"
                                        hoverGlow="hover:shadow-amber-200/60"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                            <Star className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 mt-2">PRIORITAS</span>
                                        <span className="text-sm text-slate-500">Lansia • Ibu Hamil</span>
                                        <span className="text-sm text-slate-500">Disabilitas • Balita</span>
                                    </GlassButton>
                                    <GlassButton
                                        onClick={() => handleCategorySelect('umum')}
                                        gradient="from-blue-50 to-indigo-50"
                                        border="border-blue-200"
                                        hoverGlow="hover:shadow-blue-200/60"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <Users className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 mt-2">UMUM</span>
                                        <span className="text-sm text-slate-500">Pasien Biasa</span>
                                    </GlassButton>
                                </div>
                            </div>
                        )}

                        {/* STEP: Priority Reason */}
                        {step === 'priority_reason' && (
                            <div className="animate-fadeIn">
                                <StepTitle title="Pilih Alasan Prioritas" />
                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    {priorityReasons.map((reason) => (
                                        <GlassButton
                                            key={reason.id}
                                            onClick={() => handlePriorityReasonSelect(reason.id)}
                                            gradient="from-amber-50 to-orange-50"
                                            border="border-amber-200"
                                            hoverGlow="hover:shadow-amber-200/60"
                                            className="py-5"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                                                {reason.icon}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 mt-2">{reason.label}</span>
                                            <span className="text-xs text-slate-400">{reason.sublabel}</span>
                                        </GlassButton>
                                    ))}
                                </div>
                                <BackButton onClick={() => { setStep('category'); setCategory(''); }} />
                            </div>
                        )}

                        {/* STEP: Payment Type */}
                        {step === 'payment' && (
                            <div className="animate-fadeIn">
                                <StepTitle title="Pilih Jenis Pembayaran" />
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <GlassButton
                                        onClick={() => handlePaymentSelect('bpjs')}
                                        gradient="from-emerald-50 to-green-50"
                                        border="border-emerald-200"
                                        hoverGlow="hover:shadow-emerald-200/60"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                            <Shield className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 mt-2">BPJS</span>
                                        <span className="text-sm text-slate-500">Peserta JKN</span>
                                    </GlassButton>
                                    <GlassButton
                                        onClick={() => handlePaymentSelect('umum')}
                                        gradient="from-sky-50 to-cyan-50"
                                        border="border-sky-200"
                                        hoverGlow="hover:shadow-sky-200/60"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                                            <CreditCard className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 mt-2">UMUM</span>
                                        <span className="text-sm text-slate-500">Bayar Sendiri</span>
                                    </GlassButton>
                                </div>
                                <BackButton onClick={() => setStep(category === 'prioritas' ? 'priority_reason' : 'category')} />
                            </div>
                        )}

                        {/* STEP: Polyclinic Selection */}
                        {step === 'polyclinic' && (
                            <div className="animate-fadeIn">
                                <StepTitle title="Pilih Poli Tujuan" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
                                    {polyclinics.map((poly) => (
                                        <button
                                            key={poly.id}
                                            onClick={() => setSelectedPoly(poly.id)}
                                            disabled={poly.remaining === 0}
                                            className={`group rounded-2xl p-4 text-center flex flex-col items-center gap-2 transition-all duration-300 border ${selectedPoly === poly.id
                                                ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-400/50 scale-[1.03] shadow-xl shadow-teal-500/20'
                                                : poly.remaining === 0
                                                    ? 'bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed'
                                                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-teal-300 hover:scale-[1.02] active:scale-95 shadow-sm'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedPoly === poly.id ? 'bg-teal-500 text-white shadow-lg' : 'bg-teal-50 text-teal-600 group-hover:bg-teal-100'
                                                }`}>
                                                {getPolyIcon(poly.icon)}
                                            </div>
                                            <span className="font-bold text-sm text-slate-800">{poly.name}</span>
                                            <span className={`text-xs font-medium ${poly.remaining === 0 ? 'text-red-500' : 'text-teal-600'}`}>
                                                {poly.remaining === 0 ? 'KUOTA HABIS' : `Sisa: ${poly.remaining}`}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {selectedPoly && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full mt-6 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-teal-500/30 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Ticket className="w-6 h-6" />
                                                AMBIL NOMOR ANTREAN
                                            </>
                                        )}
                                    </button>
                                )}
                                <BackButton onClick={() => setStep('payment')} />
                            </div>
                        )}

                        {/* STEP: Ticket Display */}
                        {step === 'ticket' && ticket && (
                            <div className="animate-fadeIn">
                                <div className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-slate-200/60 border border-slate-200">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Ticket className="w-6 h-6 text-teal-600" />
                                        <h2 className="text-xl font-bold text-slate-800">NOMOR ANTREAN ANDA</h2>
                                    </div>

                                    <div className={`rounded-2xl p-6 mb-5 relative overflow-hidden ${ticket.queue_category === 'prioritas'
                                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
                                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
                                        }`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white/40 to-transparent -translate-y-1/2 translate-x-1/2" />
                                        {ticket.queue_category === 'prioritas' && (
                                            <div className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                                                <Star className="w-3 h-3" /> PRIORITAS
                                            </div>
                                        )}
                                        <div className={`text-5xl md:text-7xl font-black tracking-tight ${ticket.queue_category === 'prioritas' ? 'text-orange-600' : 'text-blue-600'}`}>
                                            {ticket.queue_number}
                                        </div>
                                        {ticket.priority_reason && (
                                            <div className="text-sm font-semibold text-orange-500 mt-1 capitalize">{ticket.priority_reason}</div>
                                        )}
                                    </div>

                                    <div className="text-left space-y-2.5 text-sm">
                                        <TicketInfoRow icon={<MapPin className="w-4 h-4 text-teal-500" />} label="Poli" value={ticket.poly_name} />
                                        <TicketInfoRow icon={<CreditCard className="w-4 h-4 text-teal-500" />} label="Bayar" value={ticket.payment_type.toUpperCase()} />
                                        <TicketInfoRow icon={<Clock className="w-4 h-4 text-teal-500" />} label="Tanggal" value={ticket.date} />
                                        <TicketInfoRow icon={<Clock className="w-4 h-4 text-teal-500" />} label="Jam" value={ticket.time} />
                                        <TicketInfoRow icon={<Clock className="w-4 h-4 text-teal-500" />} label="Estimasi" value={`± ${ticket.estimated_minutes} menit`} />
                                        <TicketInfoRow icon={<Users className="w-4 h-4 text-teal-500" />} label="Sebelum Anda" value={`${ticket.waiting_before} orang`} />
                                    </div>

                                    <p className="mt-4 text-slate-400 text-sm">Silakan tunggu di ruang tunggu dan perhatikan display antrean.</p>

                                    <button
                                        onClick={resetAll}
                                        className="mt-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2 mx-auto shadow-lg shadow-teal-500/30"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Ambil Nomor Lagi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Bantuan: (0331) 337772</span>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
            `}</style>
        </>
    );
}

function getStepIndex(step: Step): number {
    return step === 'category' || step === 'priority_reason' ? 0 : step === 'payment' ? 1 : step === 'polyclinic' ? 2 : 3;
}

function StepTitle({ title }: { title: string }) {
    return <h2 className="text-center text-xl font-bold text-slate-800">{title}</h2>;
}

function GlassButton({ children, onClick, gradient, border, hoverGlow, className = '' }: {
    children: React.ReactNode; onClick: () => void; gradient: string; border: string; hoverGlow: string; className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-2xl p-6 flex flex-col items-center gap-1 transition-all duration-300 border shadow-sm
                bg-gradient-to-br ${gradient} ${border} ${hoverGlow}
                hover:scale-[1.03] hover:shadow-xl active:scale-95 ${className}`}
        >
            {children}
        </button>
    );
}

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="mt-4 text-teal-600 hover:text-teal-500 text-sm flex items-center gap-1.5 mx-auto transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
    );
}

function TicketInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}
                <span>{label}</span>
            </div>
            <span className="font-semibold text-slate-800">{value}</span>
        </div>
    );
}

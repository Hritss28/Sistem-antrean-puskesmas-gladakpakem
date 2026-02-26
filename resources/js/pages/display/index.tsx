import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Hospital, Star, Users, Clock, CheckCircle2, Timer,
    Volume2, VolumeX, Monitor, Activity, ArrowRight,
    Megaphone
} from 'lucide-react';

interface ServingQueue {
    queue_number: string;
    queue_category: string;
    priority_reason: string | null;
    counter_number: string | number;
    poly_name: string | null;
}

interface WaitingQueue {
    queue_number: string;
    priority_reason?: string | null;
    poly_name: string | null;
}

interface PolyStat { name: string; total: number; waiting: number; }

interface DisplayData {
    serving: ServingQueue[];
    priorityWaiting: WaitingQueue[];
    generalWaiting: WaitingQueue[];
    priorityRemainingCount: number;
    generalRemainingCount: number;
    totalToday: number;
    registered: number;
    waiting: number;
    priorityCount: number;
    polyStats: PolyStat[];
    announcement: string;
    puskesmasName: string;
    motto: string;
    currentDate: string;
    currentTime: string;
    ttsEnabled: boolean;
}

export default function DisplayPage() {
    const [data, setData] = useState<DisplayData | null>(null);
    const [clock, setClock] = useState(new Date());
    const [lastAnnouncement, setLastAnnouncement] = useState('');
    const [ttsOn, setTtsOn] = useState(true);
    const prevAnnouncementRef = useRef('');
    const [blinkServing, setBlinkServing] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/display/data');
            const json = await res.json();
            setData(json);
            if (ttsOn && json.ttsEnabled && json.announcement && json.announcement !== prevAnnouncementRef.current) {
                prevAnnouncementRef.current = json.announcement;
                setLastAnnouncement(json.announcement);
                speak(json.announcement);
            }
        } catch (e) { console.error('Failed to fetch', e); }
    }, [ttsOn]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        const timer = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const blink = setInterval(() => setBlinkServing(b => !b), 1500);
        return () => clearInterval(blink);
    }, []);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            // Repeat 2 times
            for (let i = 0; i < 2; i++) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'id-ID';
                u.rate = 0.85;
                u.pitch = 1;
                window.speechSynthesis.speak(u);
            }
        }
    };

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-teal-400 text-lg font-medium animate-pulse">Memuat display antrean...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Display Antrean" />
            <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden select-none">
                {/* Header */}
                <header className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 px-6 py-2.5 flex justify-between items-center shrink-0 shadow-lg shadow-teal-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                            <Hospital className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">{data.puskesmasName.toUpperCase()}</h1>
                            <p className="text-teal-300/70 text-xs italic">"{data.motto}"</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setTtsOn(!ttsOn)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title={ttsOn ? 'Mute' : 'Unmute'}>
                            {ttsOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                        </button>
                        <div className="text-right">
                            <div className="text-xs text-teal-300/80">
                                {clock.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="text-2xl font-mono font-bold tracking-widest flex items-center gap-2">
                                <Clock className="w-5 h-5 text-teal-400" />
                                {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                <span className="text-xs text-teal-400/60 font-sans">WIB</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-3 grid grid-cols-12 gap-3 overflow-hidden">
                    {/* Currently Serving — Large panel */}
                    <div className="col-span-12 lg:col-span-7">
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 border border-slate-700/50 h-full backdrop-blur">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${blinkServing ? 'bg-green-400' : 'bg-green-400/30'} transition-all duration-300`} />
                                <h2 className="text-teal-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Megaphone className="w-4 h-4" /> Sedang Dipanggil
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {data.serving.length > 0 ? data.serving.map((s, i) => (
                                    <div key={i} className="relative overflow-hidden bg-gradient-to-br from-teal-600/90 to-teal-700/90 rounded-xl p-5 text-center border border-teal-500/30 shadow-lg shadow-teal-500/10">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="text-teal-300/80 text-sm font-medium flex items-center justify-center gap-1.5 mb-1">
                                            <Monitor className="w-3.5 h-3.5" />
                                            Loket {s.counter_number}
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            {s.queue_category === 'prioritas' && <Star className="w-5 h-5 text-amber-400" />}
                                            <span className="text-5xl font-black tracking-tight">{s.queue_number}</span>
                                        </div>
                                        <div className="text-xs text-teal-200/70 mt-1 uppercase font-medium tracking-wider">{s.queue_category}</div>
                                        {s.poly_name && (
                                            <div className="text-xs text-teal-300/50 mt-1 flex items-center justify-center gap-1">
                                                <ArrowRight className="w-3 h-3" /> {s.poly_name}
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <div className="col-span-2 flex flex-col items-center justify-center py-12 text-slate-500">
                                        <Activity className="w-10 h-10 mb-2 opacity-40" />
                                        <span className="text-sm">Belum ada antrean dipanggil</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Waiting Lists */}
                    <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-3">
                        {/* Priority */}
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 border border-amber-700/30 backdrop-blur">
                            <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
                                <Star className="w-3.5 h-3.5" /> Antrean Prioritas
                                <span className="ml-auto bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px]">{data.priorityRemainingCount} sisa</span>
                            </h3>
                            <div className="space-y-1.5">
                                {data.priorityWaiting.length > 0 ? data.priorityWaiting.map((q, i) => (
                                    <div key={i} className="bg-amber-500/10 border border-amber-500/15 rounded-lg px-3 py-2 flex justify-between items-center">
                                        <span className="font-bold text-amber-300 text-sm">{q.queue_number}</span>
                                        <span className="text-amber-400/50 text-xs capitalize">{q.priority_reason}</span>
                                    </div>
                                )) : <p className="text-slate-600 text-xs text-center py-4">Tidak ada antrean</p>}
                            </div>
                        </div>

                        {/* General */}
                        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 border border-blue-700/30 backdrop-blur">
                            <h3 className="text-blue-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
                                <Users className="w-3.5 h-3.5" /> Antrean Umum
                                <span className="ml-auto bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px]">{data.generalRemainingCount} sisa</span>
                            </h3>
                            <div className="space-y-1.5">
                                {data.generalWaiting.length > 0 ? data.generalWaiting.map((q, i) => (
                                    <div key={i} className="bg-blue-500/10 border border-blue-500/15 rounded-lg px-3 py-2 flex justify-between items-center">
                                        <span className="font-bold text-blue-300 text-sm">{q.queue_number}</span>
                                        <span className="text-blue-400/50 text-xs">{q.poly_name}</span>
                                    </div>
                                )) : <p className="text-slate-600 text-xs text-center py-4">Tidak ada antrean</p>}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Announcement Bar */}
                {lastAnnouncement && (
                    <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 px-6 py-2 text-center shadow-lg animate-pulse-slow">
                        <div className="flex items-center justify-center gap-3">
                            <Megaphone className="w-5 h-5" />
                            <span className="text-lg font-bold">{lastAnnouncement}</span>
                            <Megaphone className="w-5 h-5" />
                        </div>
                    </div>
                )}

                {/* Footer Stats */}
                <footer className="bg-slate-900/90 backdrop-blur px-6 py-2 flex justify-center gap-6 text-sm shrink-0 border-t border-slate-800">
                    <FooterStat icon={<Users className="w-4 h-4 text-blue-400" />} label="Total" value={data.totalToday} />
                    <FooterStat icon={<CheckCircle2 className="w-4 h-4 text-green-400" />} label="Terdaftar" value={data.registered} />
                    <FooterStat icon={<Timer className="w-4 h-4 text-yellow-400" />} label="Menunggu" value={data.waiting} />
                    <FooterStat icon={<Star className="w-4 h-4 text-amber-400" />} label="Prioritas" value={data.priorityCount} />
                </footer>
            </div>

            <style>{`
                @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
                .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
            `}</style>
        </>
    );
}

function FooterStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-slate-500">{label}:</span>
            <span className="font-bold text-white tabular-nums">{value}</span>
        </div>
    );
}

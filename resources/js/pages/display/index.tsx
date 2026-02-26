import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

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

interface PolyStat {
    name: string;
    total: number;
    waiting: number;
}

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
    const prevAnnouncementRef = useRef('');

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/display/data');
            const json = await res.json();
            setData(json);

            // TTS Announcement
            if (json.ttsEnabled && json.announcement && json.announcement !== prevAnnouncementRef.current) {
                prevAnnouncementRef.current = json.announcement;
                setLastAnnouncement(json.announcement);
                speak(json.announcement);
            }
        } catch (e) {
            console.error('Failed to fetch display data', e);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [fetchData]);

    useEffect(() => {
        const timer = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.rate = 0.85;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-2xl animate-pulse">Memuat display antrean...</div>
            </div>
        );
    }

    return (
        <>
            <Head title="Display Antrean" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col overflow-hidden select-none">
                {/* Header */}
                <header className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-3 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🏥</span>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{data.puskesmasName.toUpperCase()}</h1>
                            <p className="text-teal-200 text-xs italic">"{data.motto}"</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-teal-200">
                            {clock.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-2xl font-mono font-bold tracking-wider">
                            {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 grid grid-cols-12 gap-4">
                    {/* Currently Serving — Big Display */}
                    <div className="col-span-12 lg:col-span-6">
                        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 h-full">
                            <h2 className="text-center text-teal-400 font-bold text-lg mb-3">
                                SEDANG DIPANGGIL
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {data.serving.length > 0 ? data.serving.map((s, i) => (
                                    <div key={i} className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-4 text-center animate-pulse-slow">
                                        <div className="text-xs text-teal-300 mb-1">Loket {s.counter_number}</div>
                                        <div className="flex items-center justify-center gap-2">
                                            {s.queue_category === 'prioritas' && <span className="text-xl">⭐</span>}
                                            <span className="text-4xl font-black">{s.queue_number}</span>
                                        </div>
                                        <div className="text-sm text-teal-200 mt-1 uppercase">{s.queue_category}</div>
                                        {s.poly_name && <div className="text-xs text-teal-300 mt-1">{s.poly_name}</div>}
                                    </div>
                                )) : (
                                    <div className="col-span-2 text-center text-slate-500 py-8">
                                        Belum ada antrean dipanggil
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Queue Lists */}
                    <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
                        {/* Priority Queue */}
                        <div className="bg-slate-800/80 rounded-2xl p-4 border border-amber-700/50">
                            <h3 className="text-amber-400 font-bold text-sm flex items-center gap-1 mb-3">
                                ⭐ ANTREAN PRIORITAS
                            </h3>
                            <div className="space-y-2">
                                {data.priorityWaiting.length > 0 ? data.priorityWaiting.map((q, i) => (
                                    <div key={i} className="bg-amber-900/30 rounded-lg px-3 py-2 flex justify-between items-center text-sm">
                                        <span className="font-bold text-amber-300">{q.queue_number}</span>
                                        <span className="text-amber-400/70 text-xs">{q.priority_reason}</span>
                                    </div>
                                )) : (
                                    <p className="text-slate-500 text-xs text-center py-4">Kosong</p>
                                )}
                            </div>
                            <div className="mt-3 text-xs text-amber-400/60 text-center">
                                Sisa: {data.priorityRemainingCount}
                            </div>
                        </div>

                        {/* General Queue */}
                        <div className="bg-slate-800/80 rounded-2xl p-4 border border-blue-700/50">
                            <h3 className="text-blue-400 font-bold text-sm flex items-center gap-1 mb-3">
                                👤 ANTREAN UMUM
                            </h3>
                            <div className="space-y-2">
                                {data.generalWaiting.length > 0 ? data.generalWaiting.map((q, i) => (
                                    <div key={i} className="bg-blue-900/30 rounded-lg px-3 py-2 flex justify-between items-center text-sm">
                                        <span className="font-bold text-blue-300">{q.queue_number}</span>
                                        <span className="text-blue-400/70 text-xs">{q.poly_name}</span>
                                    </div>
                                )) : (
                                    <p className="text-slate-500 text-xs text-center py-4">Kosong</p>
                                )}
                            </div>
                            <div className="mt-3 text-xs text-blue-400/60 text-center">
                                Sisa: {data.generalRemainingCount}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Announcement Bar */}
                {lastAnnouncement && (
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-2 text-center">
                        <span className="text-lg font-bold">📢 {lastAnnouncement}</span>
                    </div>
                )}

                {/* Footer Stats */}
                <footer className="bg-slate-800 px-6 py-2 flex justify-center gap-8 text-sm shrink-0 border-t border-slate-700">
                    <StatBadge icon="👥" label="Total Hari Ini" value={data.totalToday} />
                    <StatBadge icon="✅" label="Terdaftar" value={data.registered} />
                    <StatBadge icon="⏳" label="Menunggu" value={data.waiting} />
                    <StatBadge icon="⭐" label="Prioritas" value={data.priorityCount} />
                </footer>
            </div>

            <style>{`
                @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
                .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
            `}</style>
        </>
    );
}

function StatBadge({ icon, label, value }: { icon: string; label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span className="text-slate-400">{label}:</span>
            <span className="font-bold text-white">{value}</span>
        </div>
    );
}

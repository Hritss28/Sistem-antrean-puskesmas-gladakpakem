import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface QueueItem {
    id: number;
    queue_number: string;
    queue_category: string;
    priority_reason: string | null;
    status: string;
    poly_name: string | null;
    payment_type: string | null;
    counter_number: number | null;
}

interface Poly { id: number; name: string; }
interface DoctorOption { id: number; name: string; poly_id: number; poly_name: string | null; }
interface Stats { totalToday: number; waiting: number; served: number; skipped: number; }

interface Patient {
    id: number;
    medical_record: string;
    nik: string | null;
    bpjs_number: string | null;
    name: string;
    birth_date: string | null;
    birth_place: string | null;
    gender: string | null;
    address: string | null;
    rt_rw: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
    kabupaten: string | null;
    phone: string | null;
    blood_type: string | null;
    marital_status: string | null;
    occupation: string | null;
    allergy: string | null;
    patient_type: string;
}

interface LoketProps {
    queues: QueueItem[];
    currentServing: QueueItem | null;
    counterNumber: number;
    polyclinics: Poly[];
    doctors: DoctorOption[];
    stats: Stats;
    flash?: { success?: string; error?: string };
}

export default function LoketPage() {
    const props = usePage<{ props: LoketProps }>().props as unknown as LoketProps;
    const { queues, currentServing, counterNumber, polyclinics, doctors, stats } = props;
    const flash = (usePage().props as any).flash;

    const [tab, setTab] = useState<'baru' | 'lama'>('lama');
    const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(currentServing);
    const [counterNum, setCounterNum] = useState(counterNumber);

    // Search state
    const [searchRM, setSearchRM] = useState('');
    const [searchNIK, setSearchNIK] = useState('');
    const [searchBPJS, setSearchBPJS] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // New patient form
    const [formData, setFormData] = useState({
        nik: '', name: '', birth_date: '', birth_place: '', gender: 'L',
        address: '', rt_rw: '', kelurahan: '', kecamatan: '', kabupaten: 'Jember',
        phone: '', blood_type: '', marital_status: '', occupation: '', allergy: '',
        bpjs_number: '',
    });

    // Registration form
    const [polyId, setPolyId] = useState<number>(polyclinics[0]?.id || 0);
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [consent, setConsent] = useState({ rights: false, obligations: false, service: false, general: false });

    // BPJS state
    const [bpjsResult, setBpjsResult] = useState<any>(null);
    const [bpjsLoading, setBpjsLoading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<string>('');

    useEffect(() => {
        if (flash?.success) { setNotification(flash.success); setTimeout(() => setNotification(''), 4000); }
        if (flash?.error) { setNotification(flash.error); setTimeout(() => setNotification(''), 4000); }
    }, [flash]);

    // Auto-refresh
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['queues', 'currentServing', 'stats'] });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCallNext = () => {
        router.post('/queue/call-next', { counter_number: counterNum }, { preserveScroll: true });
    };

    const handleSkip = (queue: QueueItem) => {
        router.post(`/queue/${queue.id}/skip`, {}, { preserveScroll: true });
    };

    const handleSetCounter = (num: number) => {
        setCounterNum(num);
        router.post('/loket/set-counter', { counter_number: num }, { preserveScroll: true });
    };

    const handleSearch = async () => {
        const params = new URLSearchParams();
        if (searchRM) params.set('medical_record', searchRM);
        if (searchNIK) params.set('nik', searchNIK);
        if (searchBPJS) params.set('bpjs_number', searchBPJS);
        if (searchName) params.set('name', searchName);

        const res = await fetch(`/loket/search-patient?${params.toString()}`);
        const data = await res.json();
        setSearchResults(data.patients || []);
    };

    const handleCheckBPJS = async () => {
        const bpjsNum = tab === 'lama' ? selectedPatient?.bpjs_number : formData.bpjs_number;
        if (!bpjsNum) return;
        setBpjsLoading(true);
        try {
            const res = await fetch('/bpjs/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '' },
                body: JSON.stringify({ bpjs_number: bpjsNum }),
            });
            const data = await res.json();
            setBpjsResult(data.data);
        } catch { setBpjsResult(null); }
        setBpjsLoading(false);
    };

    const handleRegister = () => {
        if (!selectedQueue) return;
        setLoading(true);

        const payload: any = {
            queue_id: selectedQueue.id,
            patient_type: tab,
            payment_type: selectedQueue.payment_type || 'umum',
            poly_id: polyId,
            doctor_id: doctorId,
            rights_informed: consent.rights,
            obligations_informed: consent.obligations,
            service_info_given: consent.service,
            general_consent: consent.general,
        };

        if (tab === 'lama' && selectedPatient) {
            payload.patient_id = selectedPatient.id;
            payload.name = selectedPatient.name;
        } else {
            Object.assign(payload, formData);
        }

        router.post('/loket/register', payload, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedPatient(null);
                setSearchResults([]);
                setBpjsResult(null);
                setConsent({ rights: false, obligations: false, service: false, general: false });
                setFormData({ nik: '', name: '', birth_date: '', birth_place: '', gender: 'L', address: '', rt_rw: '', kelurahan: '', kecamatan: '', kabupaten: 'Jember', phone: '', blood_type: '', marital_status: '', occupation: '', allergy: '', bpjs_number: '' });
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    const filteredDoctors = doctors.filter(d => d.poly_id === polyId);

    const priorityQueues = queues.filter(q => q.queue_category === 'prioritas');
    const generalQueues = queues.filter(q => q.queue_category === 'umum');

    return (
        <>
            <Head title="Loket Pendaftaran" />
            <div className="min-h-screen bg-gray-50 flex">
                {/* LEFT SIDEBAR - Queue List */}
                <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
                    {/* Header */}
                    <div className="bg-teal-700 text-white p-3">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-sm">🎫 ANTREAN LOKET</h2>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">Loket:</span>
                                <select value={counterNum} onChange={e => handleSetCounter(Number(e.target.value))} className="bg-teal-600 text-white text-xs rounded px-1 py-0.5 border-0">
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                        <button onClick={handleCallNext} className="w-full mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm py-2 rounded-lg transition-all active:scale-95">
                            📢 PANGGIL BERIKUTNYA
                        </button>
                    </div>

                    {/* Currently serving */}
                    {currentServing && (
                        <div className="bg-teal-50 border-b border-teal-200 p-3">
                            <div className="text-xs text-teal-600 font-medium">Sedang Melayani:</div>
                            <div className="flex items-center gap-2 mt-1">
                                {currentServing.queue_category === 'prioritas' && <span>⭐</span>}
                                <span className="text-lg font-black text-teal-800">{currentServing.queue_number}</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                                <button onClick={() => { setSelectedQueue(currentServing); }} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200">Daftarkan</button>
                                <button onClick={() => handleSkip(currentServing)} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200">Skip</button>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-1 p-2 text-xs bg-gray-50 border-b">
                        <div className="bg-white rounded p-1.5 text-center">
                            <div className="font-bold text-lg text-teal-700">{stats.waiting}</div>
                            <div className="text-gray-500">Menunggu</div>
                        </div>
                        <div className="bg-white rounded p-1.5 text-center">
                            <div className="font-bold text-lg text-green-700">{stats.served}</div>
                            <div className="text-gray-500">Terdaftar</div>
                        </div>
                    </div>

                    {/* Queue list */}
                    <div className="flex-1 overflow-y-auto">
                        {priorityQueues.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-amber-600 mb-1">⭐ Prioritas</div>
                                {priorityQueues.map(q => (
                                    <QueueCard key={q.id} queue={q} selected={selectedQueue?.id === q.id} onSelect={() => setSelectedQueue(q)} />
                                ))}
                            </div>
                        )}
                        {generalQueues.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-blue-600 mb-1">👤 Umum</div>
                                {generalQueues.map(q => (
                                    <QueueCard key={q.id} queue={q} selected={selectedQueue?.id === q.id} onSelect={() => setSelectedQueue(q)} />
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* MAIN CONTENT - Registration Form */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {/* Notification */}
                    {notification && (
                        <div className="mb-3 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-lg text-sm">
                            {notification}
                        </div>
                    )}

                    {/* Current Queue Info */}
                    {selectedQueue ? (
                        <>
                            <div className={`rounded-xl p-3 mb-4 flex items-center justify-between ${selectedQueue.queue_category === 'prioritas' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                                <div className="flex items-center gap-3">
                                    {selectedQueue.queue_category === 'prioritas' && <span className="text-2xl">⭐</span>}
                                    <div>
                                        <div className="text-xl font-black">{selectedQueue.queue_number}</div>
                                        <div className="text-xs text-gray-500 uppercase">{selectedQueue.queue_category} {selectedQueue.priority_reason ? `— ${selectedQueue.priority_reason}` : ''}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <span className={`px-2 py-1 rounded-full font-medium ${selectedQueue.payment_type === 'bpjs' ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>
                                        {selectedQueue.payment_type?.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full font-medium ${statusColor(selectedQueue.status)}`}>
                                        {selectedQueue.status}
                                    </span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setTab('lama')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'lama' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    🔄 Pasien Lama
                                </button>
                                <button onClick={() => setTab('baru')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'baru' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    🆕 Pasien Baru
                                </button>
                            </div>

                            {/* Tab: Pasien Lama */}
                            {tab === 'lama' && (
                                <div className="space-y-4">
                                    <Section title="CARI PASIEN">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input label="No. RM" value={searchRM} onChange={setSearchRM} placeholder="RM-000001" />
                                            <Input label="NIK" value={searchNIK} onChange={setSearchNIK} placeholder="350912..." />
                                            <Input label="No. BPJS" value={searchBPJS} onChange={setSearchBPJS} placeholder="000123..." />
                                            <Input label="Nama" value={searchName} onChange={setSearchName} placeholder="Budi..." />
                                        </div>
                                        <button onClick={handleSearch} className="mt-2 bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg">
                                            🔍 Cari
                                        </button>
                                        {searchResults.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {searchResults.map(p => (
                                                    <button key={p.id} onClick={() => setSelectedPatient(p)} className={`w-full text-left p-2 rounded-lg text-sm border transition-all ${selectedPatient?.id === p.id ? 'bg-teal-50 border-teal-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                                        <span className="font-bold">{p.medical_record}</span> — {p.name}
                                                        <span className="text-gray-400 text-xs ml-2">{p.nik}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </Section>

                                    {selectedPatient && (
                                        <Section title="DATA PASIEN">
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                                <InfoRow label="No. RM" value={selectedPatient.medical_record} />
                                                <InfoRow label="NIK" value={selectedPatient.nik || '-'} />
                                                <InfoRow label="Nama" value={selectedPatient.name} />
                                                <InfoRow label="No. BPJS" value={selectedPatient.bpjs_number || '-'} />
                                                <InfoRow label="Tgl Lahir" value={selectedPatient.birth_date || '-'} />
                                                <InfoRow label="Gender" value={selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} />
                                                <InfoRow label="Alamat" value={selectedPatient.address || '-'} />
                                                <InfoRow label="Telepon" value={selectedPatient.phone || '-'} />
                                                <InfoRow label="Alergi" value={selectedPatient.allergy || 'Tidak ada'} />
                                            </div>
                                        </Section>
                                    )}
                                </div>
                            )}

                            {/* Tab: Pasien Baru */}
                            {tab === 'baru' && (
                                <Section title="DATA PASIEN BARU">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input label="NIK *" value={formData.nik} onChange={v => setFormData({...formData, nik: v})} />
                                        <Input label="Nama Lengkap *" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                                        <Input label="Tempat Lahir" value={formData.birth_place} onChange={v => setFormData({...formData, birth_place: v})} />
                                        <Input label="Tanggal Lahir" value={formData.birth_date} onChange={v => setFormData({...formData, birth_date: v})} type="date" />
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Jenis Kelamin</label>
                                            <div className="flex gap-3">
                                                <label className="flex items-center gap-1 text-sm">
                                                    <input type="radio" name="gender" value="L" checked={formData.gender === 'L'} onChange={() => setFormData({...formData, gender: 'L'})} /> Laki-laki
                                                </label>
                                                <label className="flex items-center gap-1 text-sm">
                                                    <input type="radio" name="gender" value="P" checked={formData.gender === 'P'} onChange={() => setFormData({...formData, gender: 'P'})} /> Perempuan
                                                </label>
                                            </div>
                                        </div>
                                        <Input label="No. BPJS" value={formData.bpjs_number} onChange={v => setFormData({...formData, bpjs_number: v})} />
                                        <div className="col-span-2"><Input label="Alamat" value={formData.address} onChange={v => setFormData({...formData, address: v})} /></div>
                                        <Input label="RT/RW" value={formData.rt_rw} onChange={v => setFormData({...formData, rt_rw: v})} placeholder="003/007" />
                                        <Input label="Kelurahan" value={formData.kelurahan} onChange={v => setFormData({...formData, kelurahan: v})} />
                                        <Input label="Kecamatan" value={formData.kecamatan} onChange={v => setFormData({...formData, kecamatan: v})} />
                                        <Input label="Kabupaten" value={formData.kabupaten} onChange={v => setFormData({...formData, kabupaten: v})} />
                                        <Input label="Telepon" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                                        <Input label="Gol. Darah" value={formData.blood_type} onChange={v => setFormData({...formData, blood_type: v})} placeholder="A/B/AB/O" />
                                        <Input label="Status Nikah" value={formData.marital_status} onChange={v => setFormData({...formData, marital_status: v})} />
                                        <Input label="Pekerjaan" value={formData.occupation} onChange={v => setFormData({...formData, occupation: v})} />
                                        <div className="col-span-2"><Input label="Alergi" value={formData.allergy} onChange={v => setFormData({...formData, allergy: v})} placeholder="Tidak ada" /></div>
                                    </div>
                                </Section>
                            )}

                            {/* BPJS Verification */}
                            {selectedQueue.payment_type === 'bpjs' && (
                                <Section title="VERIFIKASI BPJS" className="mt-4">
                                    <div className="flex gap-2 items-end">
                                        <Input label="No. BPJS" value={tab === 'lama' ? (selectedPatient?.bpjs_number || '') : formData.bpjs_number} onChange={() => {}} disabled />
                                        <button onClick={handleCheckBPJS} disabled={bpjsLoading} className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 whitespace-nowrap">
                                            {bpjsLoading ? '...' : '🏛️ Cek BPJS'}
                                        </button>
                                    </div>
                                    {bpjsResult && (
                                        <div className={`mt-2 rounded-lg p-3 ${bpjsResult.aktif ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{bpjsResult.aktif ? '✅' : '❌'}</span>
                                                <span className={`font-bold text-sm ${bpjsResult.aktif ? 'text-green-700' : 'text-red-700'}`}>
                                                    {bpjsResult.aktif ? 'PESERTA AKTIF' : 'PESERTA TIDAK AKTIF'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 text-xs">
                                                <InfoRow label="Nama" value={bpjsResult.nama} />
                                                <InfoRow label="Kelas" value={bpjsResult.jnsKelas?.nama || '-'} />
                                                <InfoRow label="Jenis" value={bpjsResult.jnsPeserta?.nama || '-'} />
                                                <InfoRow label="FKTP" value={bpjsResult.kdProviderPst?.nmProvider || '-'} />
                                            </div>
                                        </div>
                                    )}
                                </Section>
                            )}

                            {/* Mandatory Info */}
                            <Section title="INFORMASI WAJIB" className="mt-4">
                                <div className="space-y-2">
                                    <Checkbox label="Hak pasien disampaikan" checked={consent.rights} onChange={v => setConsent({...consent, rights: v})} />
                                    <Checkbox label="Kewajiban pasien disampaikan" checked={consent.obligations} onChange={v => setConsent({...consent, obligations: v})} />
                                    <Checkbox label="Info pelayanan diberikan" checked={consent.service} onChange={v => setConsent({...consent, service: v})} />
                                    <Checkbox label="Persetujuan umum ditandatangani" checked={consent.general} onChange={v => setConsent({...consent, general: v})} />
                                </div>
                            </Section>

                            {/* Poli Target */}
                            <Section title="POLI TUJUAN" className="mt-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Poli</label>
                                        <select value={polyId} onChange={e => { setPolyId(Number(e.target.value)); setDoctorId(null); }} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            {polyclinics.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Dokter</label>
                                        <select value={doctorId || ''} onChange={e => setDoctorId(e.target.value ? Number(e.target.value) : null)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                            <option value="">-- Pilih Dokter --</option>
                                            {filteredDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </Section>

                            {/* Actions */}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleRegister}
                                    disabled={loading || (tab === 'lama' && !selectedPatient) || (tab === 'baru' && !formData.name)}
                                    className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Menyimpan...' : '💾 Simpan & Daftarkan'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                            <span className="text-6xl mb-4">📋</span>
                            <p className="text-lg">Pilih nomor antrean di sidebar kiri</p>
                            <p className="text-sm">atau klik "Panggil Berikutnya" untuk memulai</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

// Components
function QueueCard({ queue, selected, onSelect }: { queue: QueueItem; selected: boolean; onSelect: () => void }) {
    return (
        <button onClick={onSelect} className={`w-full text-left p-2 rounded-lg text-xs mb-1 border transition-all ${selected ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-300' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    {queue.queue_category === 'prioritas' && <span>⭐</span>}
                    <span className="font-bold text-sm">{queue.queue_number}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColor(queue.status)}`}>
                    {queue.status}
                </span>
            </div>
            <div className="text-gray-400 mt-0.5">{queue.poly_name} • {queue.payment_type?.toUpperCase()}</div>
        </button>
    );
}

function Section({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
            {children}
        </div>
    );
}

function Input({ label, value, onChange, type = 'text', placeholder = '', disabled = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; disabled?: boolean }) {
    return (
        <div>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
        </div>
    );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400" />
            {checked ? '☑' : '☐'} {label}
        </label>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between py-0.5">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}

function statusColor(status: string): string {
    switch (status) {
        case 'waiting': return 'bg-yellow-100 text-yellow-700';
        case 'called': return 'bg-blue-100 text-blue-700';
        case 'serving': return 'bg-teal-100 text-teal-700';
        case 'registered': return 'bg-green-100 text-green-700';
        case 'skipped': return 'bg-red-100 text-red-700';
        case 'done': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-600';
    }
}

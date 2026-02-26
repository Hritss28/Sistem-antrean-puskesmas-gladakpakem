import { Head, Link, usePage } from '@inertiajs/react';

interface Stats {
    totalToday: number;
    registered: number;
    waiting: number;
    priorityCount: number;
    newPatients: number;
    oldPatients: number;
    bpjsPatients: number;
    umumPatients: number;
    avgWaitMinutes: number;
}

interface PolyStat { name: string; total: number; waiting: number; done: number; }

interface DashboardProps {
    stats: Stats;
    polyStats: PolyStat[];
}

export default function AdminDashboard() {
    const { stats, polyStats } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;
    const maxPoly = Math.max(...polyStats.map(p => p.total), 1);

    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="min-h-screen bg-gray-50">
                {/* Top Nav */}
                <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🏥</span>
                        <h1 className="text-lg font-bold text-gray-800">SI Antrean — Admin</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <NavLink href="/admin/dashboard" active>📊 Dashboard</NavLink>
                        <NavLink href="/admin/polyclinics">🏥 Poli</NavLink>
                        <NavLink href="/admin/doctors">👨‍⚕️ Dokter</NavLink>
                        <NavLink href="/admin/users">👥 Users</NavLink>
                        <NavLink href="/admin/queue-config">⚙️ Config</NavLink>
                        <NavLink href="/admin/audit-log">📝 Audit</NavLink>
                        <span className="text-gray-300">|</span>
                        <NavLink href="/loket">📋 Loket</NavLink>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
                    <p className="text-sm text-gray-500 mb-6">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard icon="👥" label="Total Pasien" value={stats.totalToday} color="bg-blue-50 text-blue-700" />
                        <StatCard icon="✅" label="Terdaftar" value={stats.registered} color="bg-green-50 text-green-700" />
                        <StatCard icon="⏳" label="Menunggu" value={stats.waiting} color="bg-yellow-50 text-yellow-700" />
                        <StatCard icon="⭐" label="Prioritas" value={stats.priorityCount} color="bg-orange-50 text-orange-700" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Per-Poly Chart */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-700 mb-4">Antrean Per Poli</h3>
                            <div className="space-y-3">
                                {polyStats.map((p, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{p.name}</span>
                                            <span className="font-bold text-gray-800">{p.total}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-3 rounded-full transition-all" style={{ width: `${(p.total / maxPoly) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Patient Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-700 mb-4">Pasien Hari Ini</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-700">{stats.newPatients}</div>
                                    <div className="text-xs text-blue-500">Pasien Baru</div>
                                    <div className="text-xs text-blue-400">{stats.totalToday > 0 ? Math.round((stats.newPatients / Math.max(stats.newPatients + stats.oldPatients, 1)) * 100) : 0}%</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-700">{stats.oldPatients}</div>
                                    <div className="text-xs text-green-500">Pasien Lama</div>
                                    <div className="text-xs text-green-400">{stats.totalToday > 0 ? Math.round((stats.oldPatients / Math.max(stats.newPatients + stats.oldPatients, 1)) * 100) : 0}%</div>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-emerald-700">{stats.bpjsPatients}</div>
                                    <div className="text-xs text-emerald-500">BPJS</div>
                                </div>
                                <div className="bg-sky-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-sky-700">{stats.umumPatients}</div>
                                    <div className="text-xs text-sky-500">Umum</div>
                                </div>
                            </div>

                            <div className="mt-4 bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-500">Rata-rata Waktu Tunggu</div>
                                <div className="text-xl font-bold text-gray-800">{stats.avgWaitMinutes} menit</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
    return (
        <div className={`rounded-xl p-4 ${color}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className="text-3xl font-black">{value}</div>
        </div>
    );
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
    return (
        <Link href={href} className={`px-2 py-1 rounded transition-all ${active ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
            {children}
        </Link>
    );
}

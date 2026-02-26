import { Head, Link, usePage } from '@inertiajs/react';

interface LogItem { id: number; user_name: string; action: string; table_name: string | null; record_id: number | null; ip_address: string | null; created_at: string; }

export default function AuditLogPage() {
    const { logs } = usePage().props as any;

    return (
        <>
            <Head title="Audit Log" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav active="audit" />
                <main className="max-w-5xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Audit Log</h2>

                    <div className="bg-white rounded-xl border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Waktu</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Aksi</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Tabel</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log: LogItem) => (
                                    <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{log.created_at}</td>
                                        <td className="px-4 py-3 font-medium">{log.user_name}</td>
                                        <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{log.action}</span></td>
                                        <td className="px-4 py-3 text-gray-500">{log.table_name || '-'}</td>
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.record_id || '-'}</td>
                                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.ip_address || '-'}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Belum ada log</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </>
    );
}

function AdminNav({ active }: { active: string }) {
    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3"><span className="text-2xl">🏥</span><h1 className="text-lg font-bold text-gray-800">SI Antrean — Admin</h1></div>
            <div className="flex items-center gap-4 text-sm">
                {[['dashboard','📊 Dashboard','/admin/dashboard'],['poli','🏥 Poli','/admin/polyclinics'],['doctors','👨‍⚕️ Dokter','/admin/doctors'],['users','👥 Users','/admin/users'],['config','⚙️ Config','/admin/queue-config'],['audit','📝 Audit','/admin/audit-log']].map(([k,l,h]) =>
                    <Link key={k} href={h as string} className={`px-2 py-1 rounded ${active === k ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>{l}</Link>
                )}
            </div>
        </nav>
    );
}

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Config { id: number; config_key: string; config_value: string; description: string | null; }

export default function QueueConfigPage() {
    const { configs: initialConfigs } = usePage().props as any;
    const [configs, setConfigs] = useState<Config[]>(initialConfigs);
    const flash = (usePage().props as any).flash;

    const handleChange = (key: string, value: string) => {
        setConfigs(configs.map(c => c.config_key === key ? { ...c, config_value: value } : c));
    };

    const handleSave = () => {
        router.post('/admin/queue-config', { configs: configs.map(c => ({ config_key: c.config_key, config_value: c.config_value })) }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Konfigurasi Antrean" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav active="config" />
                <main className="max-w-3xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Konfigurasi Antrean</h2>

                    {flash?.success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{flash.success}</div>}

                    <div className="bg-white rounded-xl border p-4 space-y-4">
                        {configs.map((c: Config) => (
                            <div key={c.config_key} className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-0">
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-700">{c.config_key}</div>
                                    <div className="text-xs text-gray-400">{c.description}</div>
                                </div>
                                <input value={c.config_value} onChange={e => handleChange(c.config_key, e.target.value)} className="w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-teal-400" />
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSave} className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all">
                        💾 Simpan Konfigurasi
                    </button>
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

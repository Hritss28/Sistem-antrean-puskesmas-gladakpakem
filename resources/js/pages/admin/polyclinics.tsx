import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Polyclinic {
    id: number; code: string; name: string; bpjs_poly_code: string | null;
    room: string | null; queue_prefix: string; quota_per_day: number;
    is_active: boolean; sort_order: number;
}

export default function PolyclinicsPage() {
    const { polyclinics } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Polyclinic | null>(null);
    const [form, setForm] = useState({ code: '', name: '', bpjs_poly_code: '', room: '', queue_prefix: '', quota_per_day: 30, is_active: true, sort_order: 0 });
    const flash = (usePage().props as any).flash;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/polyclinics/${editing.id}`, form, { preserveScroll: true, onSuccess: () => { setShowForm(false); setEditing(null); } });
        } else {
            router.post('/admin/polyclinics', form, { preserveScroll: true, onSuccess: () => { setShowForm(false); resetForm(); } });
        }
    };

    const handleEdit = (p: Polyclinic) => {
        setEditing(p);
        setForm({ code: p.code, name: p.name, bpjs_poly_code: p.bpjs_poly_code || '', room: p.room || '', queue_prefix: p.queue_prefix, quota_per_day: p.quota_per_day, is_active: p.is_active, sort_order: p.sort_order });
        setShowForm(true);
    };

    const handleDelete = (p: Polyclinic) => {
        if (confirm(`Hapus ${p.name}?`)) { router.delete(`/admin/polyclinics/${p.id}`, { preserveScroll: true }); }
    };

    const resetForm = () => setForm({ code: '', name: '', bpjs_poly_code: '', room: '', queue_prefix: '', quota_per_day: 30, is_active: true, sort_order: 0 });

    return (
        <>
            <Head title="Manajemen Poliklinik" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav active="poli" />
                <main className="max-w-5xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Poliklinik</h2>
                        <button onClick={() => { resetForm(); setEditing(null); setShowForm(!showForm); }} className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg">
                            + Tambah Poli
                        </button>
                    </div>

                    {flash?.success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{flash.success}</div>}

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <FormInput label="Kode" value={form.code} onChange={v => setForm({...form, code: v})} />
                            <FormInput label="Nama" value={form.name} onChange={v => setForm({...form, name: v})} />
                            <FormInput label="Kode BPJS" value={form.bpjs_poly_code} onChange={v => setForm({...form, bpjs_poly_code: v})} />
                            <FormInput label="Ruang" value={form.room} onChange={v => setForm({...form, room: v})} />
                            <FormInput label="Prefix Antrean" value={form.queue_prefix} onChange={v => setForm({...form, queue_prefix: v})} />
                            <FormInput label="Kuota/Hari" value={String(form.quota_per_day)} onChange={v => setForm({...form, quota_per_day: Number(v)})} type="number" />
                            <FormInput label="Urutan" value={String(form.sort_order)} onChange={v => setForm({...form, sort_order: Number(v)})} type="number" />
                            <div className="flex items-end gap-2">
                                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm">{editing ? 'Update' : 'Simpan'}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm">Batal</button>
                            </div>
                        </form>
                    )}

                    <div className="bg-white rounded-xl border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Kode</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Prefix</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Kuota</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {polyclinics.map((p: Polyclinic) => (
                                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">{p.code}</td>
                                        <td className="px-4 py-3 font-medium">{p.name}</td>
                                        <td className="px-4 py-3"><span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded font-bold text-xs">{p.queue_prefix}</span></td>
                                        <td className="px-4 py-3">{p.quota_per_day}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline mr-2 text-xs">Edit</button>
                                            <button onClick={() => handleDelete(p)} className="text-red-600 hover:underline text-xs">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
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
            <div className="flex items-center gap-3">
                <span className="text-2xl">🏥</span>
                <h1 className="text-lg font-bold text-gray-800">SI Antrean — Admin</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <Link href="/admin/dashboard" className={`px-2 py-1 rounded ${active === 'dashboard' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>📊 Dashboard</Link>
                <Link href="/admin/polyclinics" className={`px-2 py-1 rounded ${active === 'poli' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>🏥 Poli</Link>
                <Link href="/admin/doctors" className={`px-2 py-1 rounded ${active === 'doctors' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>👨‍⚕️ Dokter</Link>
                <Link href="/admin/users" className={`px-2 py-1 rounded ${active === 'users' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>👥 Users</Link>
                <Link href="/admin/queue-config" className={`px-2 py-1 rounded ${active === 'config' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>⚙️ Config</Link>
                <Link href="/admin/audit-log" className={`px-2 py-1 rounded ${active === 'audit' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>📝 Audit</Link>
                <span className="text-gray-300">|</span>
                <Link href="/loket" className="text-gray-500 hover:bg-gray-100 px-2 py-1 rounded">📋 Loket</Link>
            </div>
        </nav>
    );
}

function FormInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
    );
}

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Doctor { id: number; name: string; nip: string | null; sip_number: string | null; specialization: string | null; poly_id: number; bpjs_doctor_code: string | null; is_active: boolean; polyclinic: { id: number; name: string } | null; }
interface Poly { id: number; name: string; }

export default function DoctorsPage() {
    const { doctors, polyclinics } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Doctor | null>(null);
    const [form, setForm] = useState({ name: '', nip: '', sip_number: '', specialization: '', poly_id: '', bpjs_doctor_code: '', is_active: true });
    const flash = (usePage().props as any).flash;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form, poly_id: Number(form.poly_id) };
        if (editing) {
            router.put(`/admin/doctors/${editing.id}`, payload, { preserveScroll: true, onSuccess: () => { setShowForm(false); setEditing(null); } });
        } else {
            router.post('/admin/doctors', payload, { preserveScroll: true, onSuccess: () => { setShowForm(false); resetForm(); } });
        }
    };

    const handleEdit = (d: Doctor) => {
        setEditing(d);
        setForm({ name: d.name, nip: d.nip || '', sip_number: d.sip_number || '', specialization: d.specialization || '', poly_id: String(d.poly_id), bpjs_doctor_code: d.bpjs_doctor_code || '', is_active: d.is_active });
        setShowForm(true);
    };

    const resetForm = () => setForm({ name: '', nip: '', sip_number: '', specialization: '', poly_id: '', bpjs_doctor_code: '', is_active: true });

    return (
        <>
            <Head title="Manajemen Dokter" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav active="doctors" />
                <main className="max-w-5xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Dokter</h2>
                        <button onClick={() => { resetForm(); setEditing(null); setShowForm(!showForm); }} className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg">+ Tambah Dokter</button>
                    </div>

                    {flash?.success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{flash.success}</div>}

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                            <FI label="Nama" value={form.name} onChange={v => setForm({...form, name: v})} />
                            <FI label="NIP" value={form.nip} onChange={v => setForm({...form, nip: v})} />
                            <FI label="No. SIP" value={form.sip_number} onChange={v => setForm({...form, sip_number: v})} />
                            <FI label="Spesialisasi" value={form.specialization} onChange={v => setForm({...form, specialization: v})} />
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Poliklinik</label>
                                <select value={form.poly_id} onChange={e => setForm({...form, poly_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                    <option value="">-- Pilih --</option>
                                    {polyclinics.map((p: Poly) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <FI label="Kode BPJS" value={form.bpjs_doctor_code} onChange={v => setForm({...form, bpjs_doctor_code: v})} />
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
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Spesialisasi</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Poli</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">NIP</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((d: Doctor) => (
                                    <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{d.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{d.specialization || '-'}</td>
                                        <td className="px-4 py-3">{d.polyclinic?.name || '-'}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{d.nip || '-'}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEdit(d)} className="text-blue-600 hover:underline mr-2 text-xs">Edit</button>
                                            <button onClick={() => { if (confirm(`Hapus ${d.name}?`)) router.delete(`/admin/doctors/${d.id}`, { preserveScroll: true }); }} className="text-red-600 hover:underline text-xs">Hapus</button>
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
            <div className="flex items-center gap-3"><span className="text-2xl">🏥</span><h1 className="text-lg font-bold text-gray-800">SI Antrean — Admin</h1></div>
            <div className="flex items-center gap-4 text-sm">
                {[['dashboard','📊 Dashboard','/admin/dashboard'],['poli','🏥 Poli','/admin/polyclinics'],['doctors','👨‍⚕️ Dokter','/admin/doctors'],['users','👥 Users','/admin/users'],['config','⚙️ Config','/admin/queue-config'],['audit','📝 Audit','/admin/audit-log']].map(([k,l,h]) =>
                    <Link key={k} href={h as string} className={`px-2 py-1 rounded ${active === k ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}>{l}</Link>
                )}
            </div>
        </nav>
    );
}

function FI({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (<div><label className="text-xs text-gray-500 block mb-1">{label}</label><input value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" /></div>);
}

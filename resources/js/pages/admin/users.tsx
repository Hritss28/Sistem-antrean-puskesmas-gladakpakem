import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface UserItem { id: number; username: string; name: string; email: string | null; role: string; phone: string | null; is_active: boolean; last_login: string | null; }

export default function UsersPage() {
    const { users } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<UserItem | null>(null);
    const [form, setForm] = useState({ username: '', name: '', email: '', password: '', role: 'receptionist', phone: '', is_active: true });
    const flash = (usePage().props as any).flash;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            router.put(`/admin/users/${editing.id}`, form, { preserveScroll: true, onSuccess: () => { setShowForm(false); setEditing(null); } });
        } else {
            router.post('/admin/users', form, { preserveScroll: true, onSuccess: () => { setShowForm(false); resetForm(); } });
        }
    };

    const handleEdit = (u: UserItem) => {
        setEditing(u);
        setForm({ username: u.username, name: u.name, email: u.email || '', password: '', role: u.role, phone: u.phone || '', is_active: u.is_active });
        setShowForm(true);
    };

    const resetForm = () => setForm({ username: '', name: '', email: '', password: '', role: 'receptionist', phone: '', is_active: true });

    return (
        <>
            <Head title="Manajemen Users" />
            <div className="min-h-screen bg-gray-50">
                <AdminNav active="users" />
                <main className="max-w-5xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                        <button onClick={() => { resetForm(); setEditing(null); setShowForm(!showForm); }} className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg">+ Tambah User</button>
                    </div>

                    {flash?.success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{flash.success}</div>}

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-4 mb-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                            <FI label="Username" value={form.username} onChange={v => setForm({...form, username: v})} />
                            <FI label="Nama" value={form.name} onChange={v => setForm({...form, name: v})} />
                            <FI label="Email" value={form.email} onChange={v => setForm({...form, email: v})} />
                            <FI label={editing ? "Password (kosong = tidak ubah)" : "Password"} value={form.password} onChange={v => setForm({...form, password: v})} type="password" />
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Role</label>
                                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                    <option value="admin">Admin</option>
                                    <option value="receptionist">Petugas Loket</option>
                                </select>
                            </div>
                            <FI label="Telepon" value={form.phone} onChange={v => setForm({...form, phone: v})} />
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
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Username</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-500">Login Terakhir</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u: UserItem) => (
                                    <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">{u.username}</td>
                                        <td className="px-4 py-3 font-medium">{u.name}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>{u.role === 'admin' ? 'Admin' : 'Petugas Loket'}</span></td>
                                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{u.last_login || '-'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline mr-2 text-xs">Edit</button>
                                            <button onClick={() => { if (confirm(`Hapus ${u.name}?`)) router.delete(`/admin/users/${u.id}`, { preserveScroll: true }); }} className="text-red-600 hover:underline text-xs">Hapus</button>
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

function FI({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (<div><label className="text-xs text-gray-500 block mb-1">{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" /></div>);
}

"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText, LayoutDashboard, Linkedin, LogOut, Pencil, Save, Search, Trash2, Users, X } from "lucide-react";
import { Logo } from "@/components/Logo";

type Submission = { id: string; name: string; phone: string; instagram: string | null; linkedin: string | null; email: string; interests?: string[]; createdAt: string };
type Stats = { total: number; today: number; week: number; month: number };
type Draft = { name: string; phone: string; instagram: string; linkedin: string; email: string };

async function readJson(response: Response) { const text = await response.text(); let data: Record<string, unknown> = {}; try { data = text ? JSON.parse(text) : {}; } catch { data = { error: "The server returned an invalid response." }; } if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : `Request failed (${response.status})`); return data; }

export function AdminDashboard({ email }: { email: string }) {
  const [rows, setRows] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0, week: 0, month: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadData(targetPage = page, targetLimit = limit, searchQuery = query) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(targetLimit),
        search: searchQuery,
        _t: String(Date.now()),
      });
      const [submissions, summary] = await Promise.all([
        fetch(`/api/admin/submissions?${params.toString()}`).then(readJson),
        fetch(`/api/admin/stats?_t=${Date.now()}`).then(readJson)
      ]);
      setRows((submissions.items as Submission[]) || []);
      setTotalCount(Number(submissions.total) || 0);
      setStats({
        total: Number(summary.total) || 0,
        today: Number(summary.today) || 0,
        week: Number(summary.week) || 0,
        month: Number(summary.month) || 0
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(page, limit, query);
    }, 200);
    return () => clearTimeout(timer);
  }, [page, limit, query]);

  function beginEdit(row: Submission) { setEditing(row.id); setDraft({ name: row.name, phone: row.phone, instagram: row.instagram || "", linkedin: row.linkedin || "", email: row.email }); }
  function updateDraft(field: keyof Draft, value: string) { setDraft((current) => current ? { ...current, [field]: value } : current); }
  async function saveEdit(id: string) { if (!draft) return; setSaving(true); try { const updated = await fetch("/api/admin/submissions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...draft, instagram: draft.instagram || null, linkedin: draft.linkedin || null }) }).then(readJson) as Submission; setRows((current) => current.map((row) => row.id === id ? updated : row)); setEditing(null); setDraft(null); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update this submission."); } finally { setSaving(false); } }
  async function removeOne(id: string) { if (!window.confirm("Delete this submission? This cannot be undone.")) return; try { await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, { method: "DELETE" }).then(readJson); setRows((current) => current.filter((row) => row.id !== id)); setStats((current) => ({ ...current, total: Math.max(0, current.total - 1) })); setTotalCount((c) => Math.max(0, c - 1)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete this submission."); } }
  async function removeAll() { if (!rows.length || !window.confirm(`Delete all submissions? This cannot be undone.`) || !window.confirm("Confirm permanent deletion of all submissions.")) return; try { await fetch("/api/admin/submissions", { method: "PATCH" }).then(readJson); setRows([]); setStats({ total: 0, today: 0, week: 0, month: 0 }); setTotalCount(0); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete all submissions."); } }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/admin/login"; }

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const statCards = [["Total submissions", stats.total, "All time"], ["Today", stats.today, "Since midnight"], ["This week", stats.week, "Last 7 days"], ["This month", stats.month, "Current month"]] as const;

  return <div className="admin-layout"><aside className="sidebar"><Logo /><div className="nav-label">Workspace</div><nav><a className="nav-link active" href="#overview"><LayoutDashboard size={16} /> Overview</a><a className="nav-link" href="#submissions"><Users size={16} /> Submissions</a></nav><div className="sidebar-bottom">EgyMedya / 2026</div></aside><main className="admin-content"><header className="admin-top"><div><div className="eyebrow">Workspace / Overview</div><h1>Good morning.</h1></div><div className="admin-user"><span>{email}</span><span className="avatar">A</span><button className="button ghost" onClick={logout}><LogOut size={14} /> Log out</button></div></header><section className="stats" id="overview">{statCards.map(([label, value, trend]) => <div className="stat" key={label}><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-trend">{trend}</div></div>)}</section><section className="panel" id="submissions"><div className="panel-head"><div><h2>Recent submissions</h2><p className="panel-sub">The latest people reaching out to EgyMedya.</p></div><div className="panel-actions"><a className="button gold" href={`/api/admin/export?_t=${Date.now()}`}><Download size={15} /> Export Excel ({stats.total})</a><button className="button danger" onClick={removeAll} disabled={!rows.length}><Trash2 size={15} /> Delete all</button></div></div><div className="toolbar"><Search size={15} color="#aaa79e" /><input className="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search submissions" /><span className="toolbar-spacer" /><span className="mono">{totalCount === 0 ? "0 records" : `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, totalCount)} of ${totalCount}`}</span></div>{error ? <div className="empty error-state"><FileText size={24} /><p>{error}</p><button className="button ghost" onClick={() => loadData()}>Try again</button></div> : loading ? <div className="loading">Loading submissions...</div> : !rows.length ? <div className="empty"><FileText size={24} /><p>{query ? "No submissions match your search." : "No submissions yet."}</p></div> : <><div className="table-wrap"><table><thead><tr><th>Name</th><th>Contact</th><th>Interests</th><th>Instagram</th><th>LinkedIn</th><th>Received</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => editing === row.id && draft ? <tr key={row.id} className="editing-row"><td><input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} /></td><td><input value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} /><small><input value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} /></small></td><td><small>{row.interests && row.interests.length ? row.interests.join(", ") : "-"}</small></td><td><input value={draft.instagram} onChange={(event) => updateDraft("instagram", event.target.value)} /></td><td><input value={draft.linkedin} onChange={(event) => updateDraft("linkedin", event.target.value)} /></td><td>{new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td><td className="row-actions"><button className="icon-button save" title="Save changes" onClick={() => saveEdit(row.id)} disabled={saving}><Save size={15} /></button><button className="icon-button" title="Cancel" onClick={() => { setEditing(null); setDraft(null); }}><X size={15} /></button></td></tr> : <tr key={row.id}><td>{row.name}<small>{row.id.slice(0, 10)}</small></td><td>{row.email}<small>{row.phone}</small></td><td>{row.interests && row.interests.length ? row.interests.join(", ") : "-"}</td><td>{row.instagram || "-"}</td><td>{row.linkedin ? <a href={row.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /></a> : "-"}</td><td>{new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td><td className="row-actions"><button className="icon-button" title="Edit submission" onClick={() => beginEdit(row)}><Pencil size={15} /></button><button className="icon-button delete" title="Delete submission" onClick={() => removeOne(row.id)}><Trash2 size={15} /></button></td></tr>)}</tbody></table></div><div className="pagination-bar"><div className="pagination-info">Showing {totalCount === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} submissions</div><div className="pagination-controls"><button className="button ghost pagination-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}><ChevronLeft size={15} /> Previous</button><span className="pagination-current">Page {page} of {totalPages}</span><button className="button ghost pagination-btn" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || loading}>Next <ChevronRight size={15} /></button><select className="limit-select" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}><option value={20}>20 / page</option><option value={50}>50 / page</option><option value={100}>100 / page</option><option value={500}>All ({totalCount})</option></select></div></div></>}</section></main></div>;
}

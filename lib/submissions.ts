import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabasePublic } from "@/lib/supabase/public";

export type Submission = {
  id: string;
  name: string;
  phone: string;
  instagram: string;
  email: string;
  createdAt: string;
};

type SubmissionRow = { id: string; name: string; phone: string; instagram: string; email: string; created_at: string };

function mapRow(row: SubmissionRow): Submission {
  return { id: row.id, name: row.name, phone: row.phone, instagram: row.instagram, email: row.email, createdAt: row.created_at };
}

export async function createSubmission(input: { name: string; phone: string; instagram: string; email: string }) {
  const { error } = await getSupabasePublic().from("submissions").insert(input);
  if (error) throw error;
  return "accepted";
}

export async function findRecentDuplicate(email: string, phone: string) {
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { data, error } = await getSupabaseAdmin().from("submissions").select("id").or(`email.eq.${email},phone.eq.${phone}`).gte("created_at", since).limit(1);
  if (error) throw error;
  return data.length > 0;
}

export async function listSubmissions(search: string, page: number, limit: number) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = getSupabaseAdmin().from("submissions").select("id,name,phone,instagram,email,created_at", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,instagram.ilike.%${search}%`);
  const { data, count, error } = await query;
  if (error) throw error;
  return { items: (data as SubmissionRow[]).map(mapRow), total: count ?? 0 };
}

export async function deleteSubmission(id: string) {
  const { error } = await getSupabaseAdmin().from("submissions").delete().eq("id", id);
  if (error) throw error;
}

export async function updateSubmission(id: string, input: { name: string; phone: string; instagram: string; email: string }) {
  const { data, error } = await getSupabaseAdmin().from("submissions").update(input).eq("id", id).select("id,name,phone,instagram,email,created_at").single();
  if (error) throw error;
  return mapRow(data as SubmissionRow);
}

export async function deleteAllSubmissions() {
  const { error } = await getSupabaseAdmin().from("submissions").delete().not("id", "is", null);
  if (error) throw error;
}

export async function countSubmissions(since?: string) {
  let query = getSupabaseAdmin().from("submissions").select("id", { count: "exact", head: true });
  if (since) query = query.gte("created_at", since);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function getExportRows() {
  const { data, error } = await getSupabaseAdmin().from("submissions").select("id,name,phone,instagram,email,created_at").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as SubmissionRow[]).map(mapRow);
}

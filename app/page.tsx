import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LeadForm } from "@/components/LeadForm";

export default function Home() {
  return <main className="landing"><header className="site-header"><Logo /><Link className="mono" href="/admin"><LockKeyhole size={13} /> Admin access</Link></header><section className="landing-main"><div className="hero"><div className="eyebrow">A direct line to the team</div><h1>Make your next move <em>matter.</em></h1></div><div className="form-card"><div className="form-brand"><Logo /></div><h2 style={{ marginBottom: "24px" }}>Fill out this form to receive your photos.</h2><LeadForm /></div></section></main>;
}
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LeadForm } from "@/components/LeadForm";

export default function Home() {
  return <main className="landing"><header className="site-header"><Logo /><Link className="mono" href="/admin"><LockKeyhole size={13} /> Admin access</Link></header><section className="landing-main"><div className="hero"><div className="eyebrow">A direct line to the team</div><h1>Make your next move <em>matter.</em></h1><p className="hero-copy">Tell us where you want to go. We bring the strategy, creative thinking, and digital craft to help you get there with clarity.</p><div className="hero-rule">Let&apos;s start a conversation <ArrowRight size={14} /></div></div><div className="form-card"><div className="form-brand"><Logo /></div><div className="eyebrow">01 / Your details</div><h2>Let&apos;s make something useful.</h2><p>Leave your details and the right person from our team will be in touch.</p><LeadForm /></div></section></main>;
}
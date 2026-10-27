"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  LogOut,
  ExternalLink,
  Shield,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Radio,
  Save,
  Check,
  AlertTriangle,
  Info,
  Copy,
} from "lucide-react";
import { BlogPost } from "@/lib/blog/posts";
import { SiteSettings } from "@/lib/supabase/settings";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation tab: 'posts' | 'monetization'
  const [activeTab, setActiveTab] = useState<"posts" | "monetization">("posts");

  // Posts State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Monetization / AdSense State
  const [settings, setSettings] = useState<SiteSettings>({
    adsense_publisher_id: "",
    ads_enabled: false,
    ads_slot_header: "1234567890",
    ads_slot_compiler: "1234567891",
    ads_slot_blog: "1234567892",
  });
  const [envInfo, setEnvInfo] = useState<{
    supabaseConnected: boolean;
    envAdSensePublisherId: string | null;
    envAdsEnabled: boolean;
  }>({
    supabaseConnected: false,
    envAdSensePublisherId: null,
    envAdsEnabled: false,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [postsRes, settingsRes] = await Promise.all([
          fetch("/api/admin/posts"),
          fetch("/api/admin/settings"),
        ]);

        if (postsRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        if (postsRes.ok && isMounted) {
          const postsData = await postsRes.json();
          if (postsData.posts) {
            setPosts(postsData.posts);
          }
        }

        if (settingsRes.ok && isMounted) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            setSettings(settingsData.settings);
          }
          if (settingsData.environment) {
            setEnvInfo(settingsData.environment);
          }
        }
      } catch {
        if (isMounted) router.push("/admin/login");
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert("Failed to delete post: " + (e as Error).message);
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, status: newStatus }),
      });
      if (res.ok) {
        setPosts(
          posts.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (e) {
      alert("Failed to update status: " + (e as Error).message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsError(null);
    setSettingsSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings.");
      }

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as Error;
      setSettingsError(e.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const copyEnvSnippet = () => {
    const pubId = settings.adsense_publisher_id || "ca-pub-XXXXXXXXXXXXXXXX";
    const snippet = `# Google AdSense Production Configuration\nNEXT_PUBLIC_ADS_ENABLED=true\nNEXT_PUBLIC_ADSENSE_PUBLISHER_ID=${pubId}`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  if (loadingPosts) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-[#A1A1AA] font-mono text-xs">
        <div className="w-5 h-5 border-2 border-[#FF7900] border-t-transparent rounded-full animate-spin mr-3" />
        Verifying administrator session &amp; Supabase state...
      </div>
    );
  }

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const isAdSenseActive = settings.ads_enabled && Boolean(settings.adsense_publisher_id);

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F5] flex flex-col selection:bg-[#FF7900]/30 selection:text-white">
      {/* Admin Top Header */}
      <header className="bg-[#141416] border-b border-[#292929] px-6 py-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF7900] flex items-center justify-center text-[#0B0B0D] font-black text-xs">
                &lt;&gt;
              </div>
              <span className="font-bold text-sm text-[#F5F5F5]">
                Backbencher<span className="text-[#FF7900]">.codes</span>
              </span>
            </Link>
            <span className="text-[#292929]">|</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF7900] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Supabase Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              target="_blank"
              className="text-xs text-[#A1A1AA] hover:text-[#F5F5F5] flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Blog</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C1F] hover:bg-red-950/40 border border-[#292929] hover:border-red-800 text-xs text-[#A1A1AA] hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#292929] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "posts"
                  ? "bg-[#FF7900] text-[#0B0B0D] shadow-[0_0_15px_rgba(255,121,0,0.2)]"
                  : "bg-[#141416] text-[#A1A1AA] hover:text-white border border-[#292929]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Articles &amp; Posts ({posts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("monetization")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "monetization"
                  ? "bg-[#FF7900] text-[#0B0B0D] shadow-[0_0_15px_rgba(255,121,0,0.2)]"
                  : "bg-[#141416] text-[#A1A1AA] hover:text-white border border-[#292929]"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Google AdSense &amp; Monetization</span>
              {isAdSenseActive ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </div>

          {activeTab === "posts" && (
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7900] hover:bg-[#FF963D] text-[#0B0B0D] font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(255,121,0,0.2)]"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Article</span>
            </Link>
          )}
        </div>

        {/* TAB 1: POSTS & ARTICLES */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#141416] border border-[#292929] rounded-xl p-5 space-y-1">
                <div className="text-xs text-[#A1A1AA] font-mono uppercase">Total Articles</div>
                <div className="text-3xl font-extrabold text-[#F5F5F5]">{posts.length}</div>
              </div>
              <div className="bg-[#141416] border border-[#292929] rounded-xl p-5 space-y-1">
                <div className="text-xs text-emerald-400 font-mono uppercase flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Published
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">{publishedCount}</div>
              </div>
              <div className="bg-[#141416] border border-[#292929] rounded-xl p-5 space-y-1">
                <div className="text-xs text-amber-400 font-mono uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Drafts
                </div>
                <div className="text-3xl font-extrabold text-amber-400">{draftCount}</div>
              </div>
              <div className="bg-[#141416] border border-[#292929] rounded-xl p-5 space-y-1">
                <div className="text-xs text-[#FF7900] font-mono uppercase flex items-center gap-1">
                  <Radio className="w-3 h-3" /> AdSense Status
                </div>
                <div className="text-sm font-extrabold flex items-center gap-2 mt-2">
                  {isAdSenseActive ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live &amp; Serving Ads
                    </span>
                  ) : (
                    <span className="text-amber-400">Awaiting Key / Off</span>
                  )}
                </div>
              </div>
            </div>

            {/* Post Management Section */}
            <div className="bg-[#141416] border border-[#292929] rounded-xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-[#292929] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#F5F5F5]">Blog Posts &amp; Guides</h2>
                  <p className="text-xs text-[#A1A1AA]">
                    Only published articles are visible to visitors, RSS feeds, and Google Search.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#292929] bg-[#0B0B0D]/50 text-[#A1A1AA] uppercase font-mono text-[10px]">
                      <th className="p-4">Title &amp; Excerpt</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Published Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-[#1F1F23] hover:bg-[#1C1C1F]/60 transition-colors"
                      >
                        <td className="p-4 max-w-md">
                          <div className="font-bold text-sm text-[#F5F5F5]">{post.title}</div>
                          <div className="text-[#A1A1AA] truncate mt-0.5">{post.excerpt}</div>
                          <div className="text-[10px] text-[#71717A] font-mono mt-1">
                            slug: /{post.slug}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-[#0B0B0D] border border-[#292929] text-[#A1A1AA] font-mono text-[11px]">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(post)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-transform hover:scale-105 ${
                              post.status === "published"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                            title="Click to toggle status"
                          >
                            {post.status}
                          </button>
                        </td>
                        <td className="p-4 text-[#A1A1AA] font-mono">{post.publishedAt}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 text-[#A1A1AA] hover:text-[#FF7900] rounded hover:bg-[#0B0B0D] transition-colors"
                              title="View live article"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="p-1.5 text-[#A1A1AA] hover:text-white rounded hover:bg-[#0B0B0D] transition-colors"
                              title="Edit article"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id, post.title)}
                              className="p-1.5 text-[#A1A1AA] hover:text-red-400 rounded hover:bg-[#0B0B0D] transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#71717A]">
                          No articles yet. Click &quot;Create New Article&quot; to publish your first post.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE ADSENSE & MONETIZATION SETTINGS */}
        {activeTab === "monetization" && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-[#141416] border border-[#292929] rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#FF7900] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      Google AdSense Monetization Hub
                    </span>
                    {isAdSenseActive ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE &amp; MONETIZING
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        APPROVAL PENDING / DISABLED
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-[#F5F5F5]">
                    {isAdSenseActive
                      ? "Google AdSense is Active on Backbencher.codes"
                      : "Prepare Your AdSense Publisher Key for Approval"}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] max-w-2xl leading-relaxed">
                    Once Google AdSense approves your website, paste your Publisher ID (e.g.,{" "}
                    <code className="text-[#FF7900]">ca-pub-1234567890123456</code>) below and toggle ads ON.
                    You can either persist it instantly to your Supabase database or inject it into your Supabase / Vercel environmental variables!
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2 bg-[#0B0B0D] p-4 rounded-xl border border-[#292929] text-xs font-mono">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#71717A]">Supabase Engine:</span>
                    <span className={envInfo.supabaseConnected ? "text-emerald-400 font-bold" : "text-amber-400"}>
                      {envInfo.supabaseConnected ? "Connected" : "Pending Config"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#71717A]">Env Publisher ID:</span>
                    <span className="text-[#A1A1AA] truncate max-w-[140px]">
                      {envInfo.envAdSensePublisherId || "Not set in .env"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Form Card */}
            <div className="bg-[#141416] border border-[#292929] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#292929] pb-4">
                <h4 className="text-base font-bold text-[#F5F5F5]">AdSense Configuration Parameters</h4>
                <p className="text-xs text-[#A1A1AA]">
                  Values saved here immediately update the website without requiring code recompilation or redeployment.
                </p>
              </div>

              {settingsError && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Settings updated successfully! Changes are active.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Master Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0B0D] border border-[#292929]">
                  <div>
                    <label className="text-sm font-bold text-[#F5F5F5] block">
                      Enable Google AdSense Advertisements
                    </label>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      When enabled, Google script tags and ad banners render for visitors across the site.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, ads_enabled: !settings.ads_enabled })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.ads_enabled ? "bg-[#FF7900]" : "bg-[#292929]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.ads_enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Publisher ID Input */}
                <div>
                  <label
                    htmlFor="publisher-id"
                    className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider font-mono mb-2"
                  >
                    Google AdSense Publisher ID *
                  </label>
                  <div className="relative">
                    <input
                      id="publisher-id"
                      type="text"
                      value={settings.adsense_publisher_id}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          adsense_publisher_id: e.target.value,
                        })
                      }
                      placeholder="ca-pub-1234567890123456"
                      className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900] rounded-xl font-mono text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#52525B]"
                    />
                  </div>
                  <p className="text-[11px] text-[#71717A] mt-1.5 font-mono">
                    Must start with <code className="text-[#FF7900]">ca-pub-</code> followed by your 16-digit publisher number.
                  </p>
                </div>

                {/* Optional Ad Slot IDs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                      Header / Top Banner Slot ID
                    </label>
                    <input
                      type="text"
                      value={settings.ads_slot_header || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, ads_slot_header: e.target.value })
                      }
                      placeholder="1234567890"
                      className="w-full px-3 py-2 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded-lg text-xs font-mono text-[#F5F5F5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                      Online Compiler Bottom Slot ID
                    </label>
                    <input
                      type="text"
                      value={settings.ads_slot_compiler || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, ads_slot_compiler: e.target.value })
                      }
                      placeholder="1234567891"
                      className="w-full px-3 py-2 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded-lg text-xs font-mono text-[#F5F5F5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                      Blog Sidebar &amp; Bottom Slot ID
                    </label>
                    <input
                      type="text"
                      value={settings.ads_slot_blog || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, ads_slot_blog: e.target.value })
                      }
                      placeholder="1234567892"
                      className="w-full px-3 py-2 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded-lg text-xs font-mono text-[#F5F5F5] outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-4 border-t border-[#292929]">
                  <button
                    type="button"
                    onClick={copyEnvSnippet}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B0B0D] hover:bg-[#1C1C1F] border border-[#292929] text-xs text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedEnv ? "Copied .env config!" : "Copy for .env / Supabase"}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#FF7900] hover:bg-[#FF963D] disabled:opacity-50 text-[#0B0B0D] font-extrabold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(255,121,0,0.2)]"
                  >
                    {savingSettings ? (
                      <div className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save AdSense Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Detailed Guide on Supabase & Environmental Variables */}
            <div className="bg-[#141416] border border-[#292929] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF7900]">
                <Info className="w-4 h-4" />
                <span>How to Add AdSense Key in Supabase Environmental Variables</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Method 1 */}
                <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#292929] space-y-2">
                  <div className="font-bold text-[#F5F5F5] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF7900] text-[#0B0B0D] flex items-center justify-center font-black text-[11px]">
                      1
                    </span>
                    <span>Direct Dashboard Save</span>
                  </div>
                  <p className="text-[#A1A1AA] leading-relaxed">
                    Simply enter your <code className="text-[#FF7900]">ca-pub-XXXXXXXX</code> in the form above and click <strong>Save</strong>. It saves to your Supabase database table <code className="text-white">site_settings</code> and applies instantly.
                  </p>
                </div>

                {/* Method 2 */}
                <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#292929] space-y-2">
                  <div className="font-bold text-[#F5F5F5] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF7900] text-[#0B0B0D] flex items-center justify-center font-black text-[11px]">
                      2
                    </span>
                    <span>Supabase Edge &amp; Secrets</span>
                  </div>
                  <p className="text-[#A1A1AA] leading-relaxed">
                    In your Supabase project dashboard, navigate to <strong>Project Settings &gt; Edge Functions / Vault &gt; Secrets</strong>, and add:
                    <br />
                    <code className="text-[#FF7900] text-[11px] block mt-1">NEXT_PUBLIC_ADSENSE_PUBLISHER_ID</code>
                    <code className="text-[#FF7900] text-[11px] block">NEXT_PUBLIC_ADS_ENABLED=true</code>
                  </p>
                </div>

                {/* Method 3 */}
                <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#292929] space-y-2">
                  <div className="font-bold text-[#F5F5F5] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF7900] text-[#0B0B0D] flex items-center justify-center font-black text-[11px]">
                      3
                    </span>
                    <span>Local / Vercel Environment</span>
                  </div>
                  <p className="text-[#A1A1AA] leading-relaxed">
                    In your local <code className="text-white">.env.local</code> or Vercel Environment Variables dashboard, paste the copied snippet to configure build-time defaults.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

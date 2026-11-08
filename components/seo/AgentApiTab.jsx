// components/seo/AgentApiTab.jsx
// Tab Agent API: daftar key + revoke, form buat key (plaintext sekali),
// dan audit log 100 entri terakhir. Data lewat useSeoStore.

"use client";

import { useEffect, useState } from "react";
import { api } from "@/apiConfig";
import { FiCopy, FiKey, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import useSeoStore from "@/stores/useSeoStore";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { iconButtonClass } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";
import { AGENT_SCOPES, PUBLISH_MODES, extractApiError, formatDateTime } from "./seoUtils";

const AUDIT_ACTION_VARIANTS = {
  create: "success",
  "bulk-create": "success",
  update: "brand",
  "bulk-update": "brand",
  publish: "success",
  delete: "danger",
};

function ScopeBadge({ scope }) {
  const variant =
    scope === "seo:write" || scope === "seo:global"
      ? "brand"
      : scope === "seo:publish"
        ? "success"
        : "neutral";
  return <Badge variant={variant}>{scope}</Badge>;
}

function PublishModeBadge({ mode }) {
  return mode === "draft-only" ? (
    <Badge variant="warning">draft-only</Badge>
  ) : (
    <Badge variant="neutral">publish</Badge>
  );
}

export default function AgentApiTab() {
  const toast = useToast();
  const { agentKeys, auditLogs, agentLoading, fetchAgentData } = useSeoStore();
  const [pendingRevoke, setPendingRevoke] = useState(null);
  const [revoking, setRevoking] = useState(false);

  // Form buat key — input tetap local state (lihat stores/README.md).
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState({
    "seo:read": true,
    "seo:write": false,
    "seo:publish": false,
    "seo:global": false,
  });
  const [publishMode, setPublishMode] = useState("publish");
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState(null); // { key, warning }
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData]);

  const toggleScope = (scope) => {
    setScopes((prev) => ({ ...prev, [scope]: !prev[scope] }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const selected = AGENT_SCOPES.map((s) => s.value).filter((s) => scopes[s]);
    if (!name.trim()) {
      toast.error("Nama key wajib diisi.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Pilih minimal satu scope.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.post("/api/agent-keys", {
        name: name.trim(),
        scopes: selected,
        publishMode,
      });
      setCreatedKey({ key: res.data.key, warning: res.data.warning });
      setCopied(false);
      setName("");
      setPublishMode("publish");
      toast.success("Agent key dibuat. Salin plaintext-ya sekarang.");
      fetchAgentData();
    } catch (err) {
      console.error("Error creating agent key:", err);
      toast.error(extractApiError(err, "Gagal membuat agent key."));
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    try {
      await navigator.clipboard.writeText(createdKey.key);
      setCopied(true);
      toast.success("Key disalin ke clipboard.");
    } catch {
      toast.error("Gagal menyalin. Salin manual dari panel.");
    }
  };

  const confirmRevoke = async () => {
    if (!pendingRevoke) return;
    setRevoking(true);
    try {
      await api.delete(`/api/agent-keys/${pendingRevoke.id}`);
      toast.success(`Key "${pendingRevoke.name}" dicabut (nonaktif).`);
      setPendingRevoke(null);
      fetchAgentData();
    } catch (err) {
      console.error("Error revoking agent key:", err);
      toast.error(extractApiError(err, "Gagal mencabut key."));
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Plaintext key — state lokal, hilang saat refresh/tutup panel. */}
      {createdKey ? (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <div className="flex gap-3">
            <FiKey
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-800">
                Simpan key ini sekarang — plaintext tidak akan ditampilkan lagi.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-emerald-700">
                {createdKey.warning ||
                  "Simpan key ini sekarang. Plaintext tidak bisa ditampilkan lagi."}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <code className="nice-scrollbar min-w-0 flex-1 overflow-x-auto rounded-lg border border-emerald-200 bg-white px-3 py-2.5 font-mono text-xs text-slate-800">
                  {createdKey.key}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCopy}
                    className="sm:w-auto"
                  >
                    <FiCopy className="h-4 w-4" aria-hidden="true" />
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setCreatedKey(null)}
                    className="sm:w-auto"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* Kolom kiri: form buat key + daftar key */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Buat agent key"
              description="Key dipakai agent eksternal memanggil API SEO dengan scope terbatas."
            />
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Nama key"
                name="agentKeyName"
                required
                placeholder="mis. Hermes staging"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-slate-700">
                  Scopes
                </legend>
                <div className="space-y-2">
                  {AGENT_SCOPES.map((scope) => (
                    <label
                      key={scope.value}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition-colors hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(scopes[scope.value])}
                        onChange={() => toggleScope(scope.value)}
                        className="mt-0.5 h-5 w-5 rounded border-slate-300 text-brand-600 accent-brand-600"
                      />
                      <span className="min-w-0">
                        <span className="block font-mono text-sm font-semibold text-slate-800">
                          {scope.label}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {scope.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-slate-700">
                  Publish mode
                </legend>
                <div className="space-y-2">
                  {PUBLISH_MODES.map((mode) => (
                    <label
                      key={mode.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors hover:bg-slate-50 ${
                        publishMode === mode.value
                          ? "border-brand-300 bg-brand-50/40"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="agentKeyPublishMode"
                        value={mode.value}
                        checked={publishMode === mode.value}
                        onChange={() => setPublishMode(mode.value)}
                        className="mt-0.5 h-5 w-5 rounded border-slate-300 text-brand-600 accent-brand-600"
                      />
                      <span className="min-w-0">
                        <span className="block font-mono text-sm font-semibold text-slate-800">
                          {mode.value}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {mode.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Button type="submit" loading={creating} className="w-full">
                Buat key
              </Button>
            </form>
          </Card>

          <Card padding={false}>
            <div className="px-4 pt-4 sm:px-5">
              <CardHeader
                title="Daftar key"
                description={`${agentKeys.length} key terdaftar.`}
              />
            </div>
            {agentLoading ? (
              <div aria-hidden="true" className="space-y-3 px-4 pb-4 sm:px-5">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : agentKeys.length === 0 ? (
              <div className="px-4 pb-5 sm:px-5">
                <EmptyState
                  icon={<FiKey className="h-5 w-5" aria-hidden="true" />}
                  title="Belum ada agent key"
                  description="Buat key pertama lewat form di atas."
                />
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 border-t border-slate-100">
                {agentKeys.map((key) => (
                  <li
                    key={key.id}
                    className="flex items-start gap-3 px-4 py-3.5 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {key.name}
                        </span>
                        {key.isActive ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="danger">Nonaktif</Badge>
                        )}
                        <PublishModeBadge mode={key.publishMode} />
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        {key.keyPrefix}…
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {(Array.isArray(key.scopes) ? key.scopes : []).map(
                          (scope) => (
                            <ScopeBadge key={scope} scope={scope} />
                          )
                        )}
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        Terakhir dipakai: {formatDateTime(key.lastUsedAt)}
                      </p>
                    </div>
                    {key.isActive ? (
                      <button
                        type="button"
                        onClick={() => setPendingRevoke(key)}
                        aria-label={`Revoke key ${key.name}`}
                        title="Revoke"
                        className={iconButtonClass("danger")}
                      >
                        <FiTrash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Kolom kanan: audit log */}
        <Card padding={false}>
          <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Audit log</h2>
              <p className="mt-1 text-sm text-slate-500">
                {auditLogs.length} aksi terakhir (mutasi metadata SEO).
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchAgentData()}
              aria-label="Muat ulang audit log"
            >
              <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
              Muat ulang
            </Button>
          </div>

          {agentLoading ? (
            <div aria-hidden="true" className="space-y-3 px-4 py-4 sm:px-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="px-4 pb-5 sm:px-5">
              <EmptyState
                icon={<FiRefreshCw className="h-5 w-5" aria-hidden="true" />}
                title="Belum ada aktivitas"
                description="Aksi create/publish/delete metadata akan tercatat di sini."
              />
            </div>
          ) : (
            <>
              {/* Tabel desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-y border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Waktu
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actor
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Aksi
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        pageKey
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        IP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {auditLogs.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                          {formatDateTime(entry.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="block truncate text-slate-700">
                            {entry.actorLabel || "—"}
                          </span>
                          <Badge
                            variant={
                              entry.actorType === "agent" ? "brand" : "neutral"
                            }
                          >
                            {entry.actorType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              AUDIT_ACTION_VARIANTS[entry.action] || "neutral"
                            }
                          >
                            {entry.action}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="block max-w-[180px] truncate font-mono text-xs text-slate-600">
                            {entry.pageKey || "—"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                          {entry.ip || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Kartu mobile */}
              <ul className="space-y-2 border-t border-slate-100 p-4 md:hidden sm:p-5">
                {auditLogs.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={AUDIT_ACTION_VARIANTS[entry.action] || "neutral"}
                      >
                        {entry.action}
                      </Badge>
                      <Badge
                        variant={entry.actorType === "agent" ? "brand" : "neutral"}
                      >
                        {entry.actorType}
                      </Badge>
                      <span className="ml-auto text-[11px] text-slate-400">
                        {formatDateTime(entry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm text-slate-700">
                      {entry.actorLabel || "—"}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
                      {entry.pageKey || "—"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      IP {entry.ip || "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(pendingRevoke)}
        title="Revoke agent key ini?"
        description={`Key "${pendingRevoke?.name}" (${pendingRevoke?.keyPrefix}…) akan dinonaktifkan permanen. Agent yang memakai key ini langsung berhenti bisa akses API.`}
        confirmLabel="Revoke"
        loading={revoking}
        onConfirm={confirmRevoke}
        onClose={() => setPendingRevoke(null)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { AgencySettings } from '../../types/admin';
import {
  isSupabaseConfigured,
  SUPABASE_SQL_SCHEMA,
  getSupabaseCredentials,
  setSupabaseCredentials,
  testSupabaseConnectionDetailed,
  syncAllDataToSupabase,
  normalizeSupabaseUrl,
  SupabaseDiagnosticResult,
} from '../../lib/supabase';
import {
  Settings,
  Building2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Video,
  Check,
  Upload,
  Clock,
  Palette,
  Globe,
  Youtube,
  Sparkles,
  Database,
  Search,
  Code,
  Copy,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Layers,
  Car as CarIcon,
  Calendar,
} from 'lucide-react';

export const AgencySettingsView: React.FC = () => {
  const { settings, updateSettings, cars, bookings, showToast } = useAdminData();
  const [formData, setFormData] = useState<AgencySettings>(() => {
    const creds = getSupabaseCredentials();
    return {
      ...settings,
      seo: {
        metaTitle: 'Tlemcen Car Luxury & Prestige - Location de Voitures VIP à Tlemcen',
        metaDescription: 'Louez des véhicules de prestige à Tlemcen et à l\'Aéroport Messali Hadj Zenata. Mercedes G63, Porsche 911, Range Rover, Audi RS6.',
        keywords: 'location voiture tlemcen, location voiture luxe algerie, mercedes g63 tlemcen, aeroport zenata car rental',
        ...(settings.seo || {}),
      },
      theme: {
        mode: 'dark',
        secondaryColor: '#12121c',
        accentColor: '#ff2e4d',
        fontFamily: 'Playfair Display & Plus Jakarta Sans',
        ...(settings.theme || {}),
      },
      animations: {
        enabled: true,
        speed: 'normal',
        pageTransitions: true,
        ...(settings.animations || {}),
      },
      iframes: {
        reservationEmbedUrl: 'https://tlemcen-car.onrender.com/?embed=true&theme=emerald',
        customMapIframe: '',
        googleAnalyticsId: '',
        ...(settings.iframes || {}),
      },
      general: {
        currencyDefault: 'DZD',
        minRentalDays: 1,
        depositRequirement: true,
        ...(settings.general || {}),
      },
      supabaseConfig: {
        url: creds.url || settings.supabaseConfig?.url || '',
        anonKey: creds.key || settings.supabaseConfig?.anonKey || '',
      },
    };
  });

  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<SupabaseDiagnosticResult | null>(null);
  const [urlAutoConvertedMsg, setUrlAutoConvertedMsg] = useState<string | null>(null);

  const handleUrlChange = (rawUrl: string) => {
    const normalized = normalizeSupabaseUrl(rawUrl);
    if (normalized.isConverted) {
      setUrlAutoConvertedMsg(`L'URL du dashboard a été automatiquement convertie en point d'accès API : ${normalized.url}`);
    } else {
      setUrlAutoConvertedMsg(null);
    }
    setFormData((prev) => ({
      ...prev,
      supabaseConfig: {
        ...(prev.supabaseConfig || {}),
        url: rawUrl,
      },
    }));
  };

  const handleTestConnection = async () => {
    const rawUrl = formData.supabaseConfig?.url || '';
    const rawKey = formData.supabaseConfig?.anonKey || '';

    if (!rawUrl || !rawKey) {
      showToast('error', 'Configuration incomplète', 'Veuillez saisir l\'URL et la clé SUPABASE_ANON_KEY avant de tester.');
      return;
    }

    setIsTestingSupabase(true);
    try {
      const result = await testSupabaseConnectionDetailed(rawUrl, rawKey);
      setDiagnosticResult(result);

      if (result.connected) {
        showToast('success', 'Connexion Supabase réussie !', result.message);
        // Persist valid credentials
        setSupabaseCredentials(result.cleanedUrl, rawKey);
      } else {
        showToast('warning', 'Diagnostic Supabase', result.message);
      }
    } catch (err: any) {
      showToast('error', 'Erreur de test', err?.message || String(err));
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleSyncAllToSupabase = async () => {
    const rawUrl = formData.supabaseConfig?.url || '';
    const rawKey = formData.supabaseConfig?.anonKey || '';

    if (!rawUrl || !rawKey) {
      showToast('error', 'Supabase non configuré', 'Veuillez renseigner SUPABASE_URL et SUPABASE_ANON_KEY.');
      return;
    }

    setIsSyncingAll(true);
    try {
      setSupabaseCredentials(rawUrl, rawKey);
      const res = await syncAllDataToSupabase(formData, cars, bookings);

      if (res.success) {
        showToast('success', 'Synchronisation réussie !', res.message);
        // Re-run diagnostic
        const diag = await testSupabaseConnectionDetailed(rawUrl, rawKey);
        setDiagnosticResult(diag);
      } else {
        showToast('error', 'Échec de synchronisation', res.message);
      }
    } catch (err: any) {
      showToast('error', 'Erreur de synchronisation', err?.message || String(err));
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.supabaseConfig?.url && formData.supabaseConfig?.anonKey) {
      const normalized = normalizeSupabaseUrl(formData.supabaseConfig.url);
      setSupabaseCredentials(normalized.url, formData.supabaseConfig.anonKey);
    }
    updateSettings(formData);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('success', 'Script SQL copié !', 'Collez ce script dans l\'éditeur SQL de Supabase (SQL Editor) puis cliquez sur "Run".');
    setTimeout(() => setCopiedSql(false), 3500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, faviconUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const hasSupabase = isSupabaseConfigured() || Boolean(formData.supabaseConfig?.url && formData.supabaseConfig?.anonKey);

  return (
    <div className="space-y-6">
      <div className="bg-[#0e0e14]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
        <div>
          <h2 className="text-xl font-black text-white font-serif flex items-center">
            <Settings className="w-5 h-5 text-[#ff2e4d] mr-2" />
            Paramètres Généraux de l'Agence & Synchronisation Supabase
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestion intégrale : voitures, photos, logo, favicon, téléphone, WhatsApp, réseaux sociaux, SEO, couleurs, thème, animations, iframes et Supabase.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSyncAllToSupabase}
            disabled={isSyncingAll}
            className="px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Synchronisation...' : 'Synchroniser Tout vers Supabase'}</span>
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-[#ff2e4d] to-[#d60029] hover:from-[#e60026] hover:to-[#b30020] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>Enregistrer Tout</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: All Settings (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Section 0: Supabase Database Direct Integration */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-emerald-500/40 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white border-l-2 border-emerald-500 pl-3 flex items-center">
                <Database className="w-4 h-4 mr-2 text-emerald-400" />
                Connexion Supabase (Base de Données & Stockage Photos)
              </h3>
              <div className="flex items-center space-x-2">
                {diagnosticResult?.connected || hasSupabase ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Supabase Connecté
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Non connecté
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Toutes les données (voitures, photos, logo, favicon, téléphone, SEO, thème, réservations) sont lues et sauvegardées directement dans votre projet Supabase. En cas de coupure, une persistance locale automatique prend le relais.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  URL du projet Supabase (SUPABASE_URL) <span className="text-emerald-400 font-normal">(ex: https://xyz.supabase.co)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://abcdefghijklmn.supabase.co"
                  value={formData.supabaseConfig?.url || ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
                {urlAutoConvertedMsg && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 shrink-0" />
                    {urlAutoConvertedMsg}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Clé Publique Supabase (SUPABASE_ANON_KEY)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={formData.supabaseConfig?.anonKey || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supabaseConfig: {
                        ...(formData.supabaseConfig || {}),
                        anonKey: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Test Connection Button & Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingSupabase}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center space-x-2 transition-all"
              >
                <Zap className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-bounce' : ''}`} />
                <span>{isTestingSupabase ? 'Test de diagnostic en cours...' : 'Tester la Connexion & les Tables'}</span>
              </button>

              <button
                type="button"
                onClick={handleSyncAllToSupabase}
                disabled={isSyncingAll}
                className="px-4 py-2.5 bg-[#181824] hover:bg-[#202030] text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Remplir / Synchroniser Supabase ({cars.length} Véhicules)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlViewer(!showSqlViewer)}
                className="px-3.5 py-2.5 bg-[#14141e] hover:bg-[#1a1a28] text-gray-300 border border-white/10 text-xs rounded-xl flex items-center space-x-1.5 transition-all ml-auto"
              >
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showSqlViewer ? 'Masquer le Script SQL' : 'Voir le Script SQL d\'initialisation'}</span>
                {showSqlViewer ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>

            {/* Live Diagnostic Results Card */}
            {diagnosticResult && (
              <div className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                diagnosticResult.connected
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {diagnosticResult.connected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-white text-sm">
                      {diagnosticResult.connected ? 'Statut : Connecté et Fonctionnel' : 'Statut : Tables ou Permissions à configurer'}
                    </span>
                  </div>
                </div>

                <p className="text-[12px]">{diagnosticResult.message}</p>

                {/* Table Diagnostic Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-white/10">
                  <div className="bg-[#0e0e14] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-300">Table <code className="text-emerald-300">app_settings</code></span>
                    {diagnosticResult.appSettingsTable.exists ? (
                      <span className="text-emerald-400 font-bold text-[11px]">✓ Présente</span>
                    ) : (
                      <span className="text-rose-400 font-bold text-[11px]">✗ Manquante</span>
                    )}
                  </div>

                  <div className="bg-[#0e0e14] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-300">Table <code className="text-emerald-300">cars</code></span>
                    {diagnosticResult.carsTable.exists ? (
                      <span className="text-emerald-400 font-bold text-[11px]">✓ ({diagnosticResult.carsTable.rowCount ?? 0} autos)</span>
                    ) : (
                      <span className="text-rose-400 font-bold text-[11px]">✗ Manquante</span>
                    )}
                  </div>

                  <div className="bg-[#0e0e14] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-300">Table <code className="text-emerald-300">bookings</code></span>
                    {diagnosticResult.bookingsTable.exists ? (
                      <span className="text-emerald-400 font-bold text-[11px]">✓ ({diagnosticResult.bookingsTable.rowCount ?? 0} résas)</span>
                    ) : (
                      <span className="text-rose-400 font-bold text-[11px]">✗ Manquante</span>
                    )}
                  </div>

                  <div className="bg-[#0e0e14] p-2 rounded-lg border border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-300">Storage <code className="text-emerald-300">cars</code></span>
                    {diagnosticResult.storageBucketCars.exists ? (
                      <span className="text-emerald-400 font-bold text-[11px]">✓ Actif</span>
                    ) : (
                      <span className="text-amber-400 font-bold text-[11px]">Non détecté</span>
                    )}
                  </div>
                </div>

                {diagnosticResult.suggestedAction && (
                  <div className="bg-[#0e0e14]/80 p-3 rounded-lg border border-white/10 text-[11px] text-gray-300 flex items-start space-x-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Solution recommandée :</strong> {diagnosticResult.suggestedAction}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SQL Script Quick Bar */}
            <div className="bg-[#12121c] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white flex items-center">
                  <Code className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Script SQL Complet d'Initialisation & Auto-Remplissage (3 Tables + 8 Voitures + Bucket)
                </span>
                <p className="text-[11px] text-gray-400">
                  Copiez et collez ce script dans l'éditeur SQL de votre tableau de bord Supabase (<a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline inline-flex items-center">SQL Editor <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>) puis cliquez sur "Run".
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copié dans le presse-papier !' : 'Copier le Script SQL'}</span>
                </button>
              </div>
            </div>

            {/* Expandable SQL Code Box */}
            {showSqlViewer && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono text-[11px]">supabase_schema_and_seed.sql</span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-semibold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copier tout le script</span>
                  </button>
                </div>
                <pre className="w-full bg-[#08080c] border border-white/10 rounded-xl p-4 text-[11px] text-gray-300 font-mono max-h-72 overflow-y-auto whitespace-pre-wrap select-all">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            )}
          </div>

          {/* Section 1: Logo, Favicon & Brand Identity */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Identité de Marque, Logos & Photos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Nom de l'Agence *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Slogan de l'Agence</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>
            </div>

            {/* Logo Image Picker */}
            <div className="pt-2">
              <label className="block text-gray-300 font-bold mb-1">Logo de l'Agence</label>
              <div className="flex items-center space-x-4 bg-[#14141e] p-4 rounded-xl border border-white/5">
                <div className="w-16 h-16 rounded-xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo Agence" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-[#ff2e4d]" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="url"
                    placeholder="URL du logo (ex: https://...)"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                  />

                  <label className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#1f1f2e] hover:bg-[#2a2a3e] text-gray-200 text-xs font-semibold rounded-xl border border-white/10 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#ff2e4d]" />
                    <span>Téléverser une image de logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Favicon & Theme Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Favicon (Icône Onglet)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="url"
                    placeholder="URL Favicon (ex: https://.../favicon.png)"
                    value={formData.faviconUrl || ''}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    className="flex-1 bg-[#14141e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                  <label className="px-3 py-2 bg-[#1f1f2e] hover:bg-[#2a2a3e] text-gray-200 rounded-xl border border-white/10 cursor-pointer text-xs flex items-center">
                    <Upload className="w-3.5 h-3.5 mr-1 text-[#ff2e4d]" />
                    <span>Fichier</span>
                    <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Couleur Principale (Accent)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.primaryColor || '#ff2e4d'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryColor: e.target.value,
                        theme: { ...(formData.theme || {}), accentColor: e.target.value },
                      })
                    }
                    className="w-10 h-10 rounded-xl border border-white/20 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#ff2e4d'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryColor: e.target.value,
                        theme: { ...(formData.theme || {}), accentColor: e.target.value },
                      })
                    }
                    className="flex-1 bg-[#14141e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Locations */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Coordonnées, Téléphones, WhatsApp & Adresses
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Numéro WhatsApp (Format international sans +)</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="213550001122"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Téléphone Principal (Affichage)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#ff2e4d] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+213 550 00 11 22"
                    value={formData.phoneFormatted}
                    onChange={(e) => setFormData({ ...formData, phoneFormatted: e.target.value, phone: e.target.value })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Adresse E-mail Officielle</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Adresse de l'Agence Principale</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Antenne Aéroport Tlemcen Zenata</label>
                <input
                  type="text"
                  value={formData.airportBranch}
                  onChange={(e) => setFormData({ ...formData, airportBranch: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Disponibilité & Horaires d'Assistance</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Social Networks */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Globe className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Réseaux Sociaux de l'Agence
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Instagram</label>
                <div className="relative">
                  <Instagram className="w-4 h-4 text-pink-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://instagram.com/tlemcencar_luxury"
                    value={formData.socials.instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })
                    }
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Facebook</label>
                <div className="relative">
                  <Facebook className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://facebook.com/tlemcencar"
                    value={formData.socials.facebook}
                    onChange={(e) =>
                      setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })
                    }
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">TikTok</label>
                <div className="relative">
                  <Video className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@tlemcencar"
                    value={formData.socials.tiktok || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, socials: { ...formData.socials, tiktok: e.target.value } })
                    }
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">YouTube</label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://youtube.com/@tlemcencar"
                    value={formData.socials.youtube || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })
                    }
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: SEO & Meta Tags */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Search className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Référencement Naturel (SEO & Google)
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Titre de la Page (Meta Title)</label>
                <input
                  type="text"
                  value={formData.seo?.metaTitle || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...(formData.seo || {}), metaTitle: e.target.value },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Description Google (Meta Description)</label>
                <textarea
                  rows={2}
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...(formData.seo || {}), metaDescription: e.target.value },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Mots-clés SEO (séparés par des virgules)</label>
                <input
                  type="text"
                  value={formData.seo?.keywords || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...(formData.seo || {}), keywords: e.target.value },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>
            </div>
          </div>

          {/* Section 5: iFrames, Embeds & Advanced */}
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Palette className="w-4 h-4 mr-2 text-[#ff2e4d]" />
              Intégrations iFrame, Analytics & Préférences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">URL de Réservation Externe (Iframe Embed)</label>
                <input
                  type="text"
                  value={formData.iframes?.reservationEmbedUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iframes: { ...(formData.iframes || {}), reservationEmbedUrl: e.target.value },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">ID Google Analytics</label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={formData.iframes?.googleAnalyticsId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iframes: { ...(formData.iframes || {}), googleAnalyticsId: e.target.value },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Vitesse des Animations</label>
                <select
                  value={formData.animations?.speed || 'normal'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      animations: { ...(formData.animations || {}), speed: e.target.value as any },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                >
                  <option value="fast">Rapide</option>
                  <option value="normal">Normale (Recommandé)</option>
                  <option value="slow">Douce</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Devise par Défaut</label>
                <select
                  value={formData.general?.currencyDefault || 'DZD'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...(formData.general || {}), currencyDefault: e.target.value as any },
                    })
                  }
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff2e4d]"
                >
                  <option value="DZD">Dinar Algérien (DZD DA)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl sticky top-28">
            <h3 className="text-sm font-bold text-white border-l-2 border-[#ff2e4d] pl-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-[#ff2e4d]" />
              Aperçu en Direct du Site
            </h3>

            <div className="bg-[#12121c] p-5 rounded-xl border border-white/5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff2e4d] to-[#99001a] p-0.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#ff2e4d]" />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-serif">{formData.name}</h4>
                  <p className="text-[11px] text-gray-400">{formData.tagline}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp: {formData.whatsapp}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#ff2e4d]" />
                  <span>{formData.phoneFormatted}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-start space-x-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{formData.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.4)] transition-all flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer Tout dans Supabase</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={isSyncingAll}
                  className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                  <span>Synchroniser Véhicules & Paramètres</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

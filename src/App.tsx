/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Shell } from "./components/layout/Shell";
import { Dashboard } from "./components/dashboard/Dashboard";
import { StationMap } from "./components/map/StationMap";
import { StationList } from "./components/stations/StationList";
import { StationForm } from "./components/stations/StationForm";
import { LoginPage } from "./components/auth/LoginPage";
import { subscribeToStations, upsertStation, deleteStation } from "./services/stationService";
import { Station } from "./types";
import { Loader2 } from "lucide-react";

const AppContent: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [stations, setStations] = useState<Station[]>([]);
  const [editingStation, setEditingStation] = useState<Partial<Station> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToStations((data) => {
        setStations(data);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage lang={lang} />;
  }

  const handleSave = async (data: Partial<Station>) => {
    try {
      await upsertStation(data, user.uid);
      setEditingStation(null);
    } catch (err) {
      console.error(err);
      alert("Error saving station. Check permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      await deleteStation(id);
      setEditingStation(null);
    }
  };

  return (
    <Shell activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang}>
      {activeTab === "dashboard" && <Dashboard stations={stations} lang={lang} />}
      {activeTab === "map" && <StationMap stations={stations} lang={lang} />}
      {activeTab === "stations" && (
        <StationList 
          stations={stations} 
          lang={lang} 
          onEdit={(s) => setEditingStation(s)}
          onAdd={() => setEditingStation({})}
        />
      )}
      {activeTab === "settings" && (
        <div className="glass-panel p-10 text-center">
           <h2 className="text-xl font-bold mb-4">Account Settings</h2>
           <p className="text-slate-500">Integration and user role management coming soon.</p>
        </div>
      )}

      {editingStation && (
        <StationForm 
          station={editingStation}
          onClose={() => setEditingStation(null)}
          onSave={handleSave}
          onDelete={profile?.role === 'admin' ? handleDelete : undefined}
          lang={lang}
        />
      )}
    </Shell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

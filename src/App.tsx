import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { db } from './lib/db';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/main/Dashboard';
import { RoadmapView } from './pages/main/Roadmap';
import { Assistant } from './pages/main/Assistant';
import { Portfolio } from './pages/main/Portfolio';
import { Auth } from './pages/main/Auth';
import { LandingPage } from './pages/landing/LandingPage';
import { Onboarding } from './pages/main/Onboarding';
import { LearningView } from './pages/main/LearningView';

// Helper to protect routes requiring an active roadmap
function RoadmapGuard() {
  const [hasRoadmap, setHasRoadmap] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getActiveRoadmap(user.id).then((data) => {
          setHasRoadmap(!!data);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--brand-muted))]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--brand-primary))]"></div>
    </div>
  );

  if (!hasRoadmap) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

// Helper to prevent users with roadmap from re-onboarding
function OnboardingGuard() {
  const [hasRoadmap, setHasRoadmap] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        db.getActiveRoadmap(user.id).then((data) => {
          setHasRoadmap(!!data);
          setLoading(false);
        });
      }
    });
  }, []);

  if (loading) return null;
  if (hasRoadmap) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--brand-muted))]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--brand-primary))]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!session ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route element={<Layout />}>
              <Route element={<RoadmapGuard />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/roadmap" element={<RoadmapView />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/learning/:taskId" element={<LearningView />} />
              </Route>

              <Route path="/portfolio" element={<Portfolio />} />

              <Route element={<OnboardingGuard />}>
                <Route path="/onboarding" element={<Onboarding />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

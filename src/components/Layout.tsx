import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNavbar } from './MainNavbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--brand-muted))] selection:bg-green-100 text-[hsl(var(--brand-dark))]">
      <MainNavbar />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
        <Outlet />
      </main>
    </div>
  );
}

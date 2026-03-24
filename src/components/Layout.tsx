import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNavbar } from './MainNavbar';
import { SettingsFab } from './SettingsFab';

export function Layout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--brand-muted))] dark:bg-gray-950 selection:bg-green-100 text-[hsl(var(--brand-dark))] dark:text-gray-100 transition-colors duration-300">
      <MainNavbar />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 w-full">
        <Outlet />
      </main>
      <SettingsFab />
    </div>
  );
}

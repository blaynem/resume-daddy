'use client';
import { DocumentTextIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();
  const links = [
    {
      href: '/dashboard',
      icon: HomeModernIcon,
      label: 'Home',
      insertBreak: true,
    },
    {
      href: '/dashboard/ask',
      icon: DocumentTextIcon,
      label: 'Ask',
    },
    // {
    //   href: '/dashboard/',
    //   icon: ChartBarIcon,
    //   label: 'Analytics',
    // },
    // {
    //   href: '/dashboard/',
    //   icon: Cog6ToothIcon,
    //   label: 'Settings',
    // },
  ];
  return (
    <nav
      className={`justify-around gap-0 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg min-w-[64px] mb-auto flex-col rounded-lg border`}
    >
      {links.map((link) => (
        <div key={link.href}>
          <Link
            key={link.href}
            href={link.href}
            className={`flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 ${
              pathname === link.href
                ? 'bg-indigo-50 text-indigo-600 dark:bg-sky-900 dark:text-sky-50'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800'
            }`}
          >
            {React.createElement(link.icon, {
              className: 'h-6 w-6',
              'aria-hidden': 'true',
            })}
            <small className="text-xs font-medium">{link.label}</small>
          </Link>
          {link.insertBreak && (
            <div className="border-b border-gray-200 w-full"></div>
          )}
        </div>
      ))}
    </nav>
  );
};

import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
}) => {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      {sidebar && <aside className="w-64 bg-slate-50 border-r border-slate-200">{sidebar}</aside>}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {header && <header className="border-b border-slate-200">{header}</header>}

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>

        {/* Footer */}
        {footer && <footer className="border-t border-slate-200">{footer}</footer>}
      </div>
    </div>
  );
};

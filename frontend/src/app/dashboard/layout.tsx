import SideNav from '@/components/sidenavs2';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-indigo-200">
      {/* Sidebar */}
        <SideNav />

      {/* Main Content Area */}
      <main className="flex-grow p-4 overflow-y-auto md:p-8 bg-indigo-200">
        {children}
      </main>
    </div>
  );
}

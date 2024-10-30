import SideNav from '@/components/sideNavigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="flex-none w-full md:w-60 lg:w-80 bg-purple-400">
        <SideNav />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow p-4 overflow-y-auto md:p-8 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import MobileDrawer from './MobileDrawer';
import StatsPanel from '../dashboard/StatsPanel';
import '../../styles/layout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isMobile, isDesktop } = useResponsive();
  const [activeNav, setActiveNav] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="app-layout">
      {isDesktop && <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />}
      {isMobile && (
        <>
          <Header onMenuClick={() => setIsDrawerOpen(true)} />
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            activeItem={activeNav}
            onNavigate={setActiveNav}
          />
        </>
      )}

      <main className={`main-content ${isDesktop ? 'with-sidebar' : ''} ${isMobile ? 'with-header' : ''}`}>
        {children}
      </main>

      {isDesktop && <StatsPanel />}
      {isMobile && <BottomNav activeTab={activeNav} onTabChange={setActiveNav} />}
    </div>
  );
}

import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import PhoneFrame from './PhoneFrame';

export default function Layout() {
  const location = useLocation();
  return (
    <PhoneFrame>
      <div style={{ flex:'1 1 0%', minHeight:0, overflowY:'scroll', background:'var(--color-cream)' }}>
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

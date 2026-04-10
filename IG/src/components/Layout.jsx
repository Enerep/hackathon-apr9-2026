import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import PhoneFrame from './PhoneFrame';

export default function Layout() {
  const location = useLocation();

  return (
    <PhoneFrame>
      <div className="flex-1 min-h-0 overflow-y-auto bg-cream">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

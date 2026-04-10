import { NavLink } from 'react-router-dom';
import { Home, Search, Camera, Heart, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/camera', icon: Camera, label: 'Camera' },
  { to: '/activity', icon: Heart, label: 'Activity' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav className="shrink-0 bg-paper/95 backdrop-blur-sm border-t border-tan/30 z-50 pb-5">
      <div className="flex justify-around items-center h-12">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-[48px] min-h-[44px] justify-center transition-all active:scale-90 ${
                isActive ? 'text-dark' : 'text-brown/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

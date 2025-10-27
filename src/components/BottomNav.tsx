import { NavLink } from "react-router-dom";
import { LayoutDashboard, Bell, Settings } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "看板" },
    { path: "/alarms", icon: Bell, label: "告警" },
    { path: "/devices", icon: Settings, label: "设备" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

import { CalendarCheck, Users, PlusSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import "../../styles/pages/admin/admin.css"

export default function AdminSidebar() {
  return (
    <aside className="sidebar">
      {/* Logo / Title */}
      <div className="sidebar-header">
        <h2>Admin</h2>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <a href="/admin/bookings" className="sidebar-link">
          <CalendarCheck size={18} />
          <span>Bookings</span>
        </a>

        <a href="/admin/clients" className="sidebar-link">
          <Users size={18} />
          <span>Clients</span>
        </a>

        <a href="/admin/centers/new" className="sidebar-link primary">
          <PlusSquare size={18} />
          <span>Add Center</span>
        </a>
      </nav>

      {/* Bottom */}
      <div className="sidebar-footer">
        <Button variant="ghost">Logout</Button>
      </div>
    </aside>
  );
}

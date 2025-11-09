import { 
  LayoutDashboard, 
  ShoppingCart, 
  Mail, 
  Users, 
  BarChart3, 
  Zap, 
  Package,
  Radio,
  AlertTriangle,
  Gift
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { id: "overview", title: "Overview", icon: LayoutDashboard },
  { id: "orders", title: "Orders & Customers", icon: ShoppingCart },
  { id: "raffles", title: "Raffle Manager", icon: Gift },
  { id: "email", title: "Email Center", icon: Mail },
  { id: "broadcast", title: "Broadcast Tester", icon: Radio },
  { id: "broadcast-alerts", title: "Broadcast Alerts", icon: AlertTriangle },
  { id: "users", title: "User Management", icon: Users },
  { id: "analytics", title: "Analytics & KPIs", icon: BarChart3 },
  { id: "automation", title: "Automation", icon: Zap },
  { id: "products", title: "Products & Courses", icon: Package },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className="w-60">
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>3rdeyeadvisors Admin</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    className={activeSection === item.id ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

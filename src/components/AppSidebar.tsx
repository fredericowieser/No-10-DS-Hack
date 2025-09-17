import { Home, User, Settings, Phone, Heart } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
const navigationItems = [{
  title: "Home",
  url: "/",
  icon: Home
}, {
  title: "Patient Portal",
  url: "/patient-portal",
  icon: Heart
}, {
  title: "Clinician Portal",
  url: "/clinician-portal",
  icon: Phone
}, {
  title: "Profile",
  url: "/profile",
  icon: User
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  
  return <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} size="lg">
                    <NavLink to={item.url} className="flex items-center gap-3 text-base">
                      <item.icon className="h-9 w-5" />
                      <span className="text-base">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-center">
          <img src="/lovable-uploads/2873cff1-4cf2-49a1-bda8-48aa827ba056.png" alt="NHS" className={`transition-all duration-200 ${state === "collapsed" ? "h-8 w-auto" : "h-16 w-auto max-w-full"}`} />
        </div>
      </SidebarFooter>
    </Sidebar>;
}
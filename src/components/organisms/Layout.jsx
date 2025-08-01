import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/patients/")) return "Patient Details";
    const pathMap = {
      "/patients": "Patients",
      "/appointments": "Appointments", 
      "/staff": "Staff Directory",
      "/inventory": "Inventory Management",
      "/billing": "Billing & Invoices",
      "/reports": "Reports & Analytics"
    };
    return pathMap[path] || "MediHub Pro";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:pl-64">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle()}
        />
        
        <main className="px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
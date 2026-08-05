// Prepared architecture for future Administration Dashboard module
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'agent_tlemcen' | 'agent_zenata';
  avatar?: string;
}

export interface AgencyMetrics {
  totalCars: number;
  activeRentals: number;
  pendingBookings: number;
  monthlyRevenueDZD: number;
  monthlyRevenueEUR: number;
  airportDeliveriesToday: number;
}

export interface VehicleMaintenanceLog {
  id: string;
  carId: string;
  date: string;
  type: 'vidange' | 'pneus' | 'controle_technique' | 'nettoyage_vip';
  costDZD: number;
  notes: string;
}

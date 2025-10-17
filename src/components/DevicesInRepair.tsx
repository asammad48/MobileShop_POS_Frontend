import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

interface Device {
  id: string;
  deviceName: string;
  customerName: string;
  issue: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedDate: string;
}

interface DevicesInRepairProps {
  devices?: Device[];
}

export default function DevicesInRepair({ devices: propDevices }: DevicesInRepairProps) {
  //todo: remove mock functionality
  const mockDevices: Device[] = [
    { id: 'D001', deviceName: 'iPhone 13 Pro', customerName: 'John Doe', issue: 'Screen Replacement', status: 'in_progress', estimatedDate: '2024-10-15' },
    { id: 'D002', deviceName: 'Samsung S21', customerName: 'Jane Smith', issue: 'Battery Issue', status: 'pending', estimatedDate: '2024-10-16' },
    { id: 'D003', deviceName: 'iPhone 12', customerName: 'Mike Johnson', issue: 'Water Damage', status: 'in_progress', estimatedDate: '2024-10-17' },
    { id: 'D004', deviceName: 'iPad Air', customerName: 'Sarah Williams', issue: 'Screen Crack', status: 'completed', estimatedDate: '2024-10-14' },
  ];

  const devices = propDevices || mockDevices;

  const getStatusConfig = (status: string) => {
    if (status === 'completed') return { variant: 'default' as const, label: 'Completed', color: 'bg-emerald-500' };
    if (status === 'in_progress') return { variant: 'secondary' as const, label: 'In Progress', color: 'bg-blue-500' };
    return { variant: 'destructive' as const, label: 'Pending', color: 'bg-amber-500' };
  };

  return (
    <Card className="shadow-lg border-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Devices in Repair</h3>
            <p className="text-sm text-muted-foreground">Active repair queue</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Device</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Issue</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Est. Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => {
              const statusConfig = getStatusConfig(device.status);
              return (
                <TableRow key={device.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-sm font-medium">{device.id}</TableCell>
                  <TableCell className="font-semibold">{device.deviceName}</TableCell>
                  <TableCell>{device.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">{device.issue}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                      <Badge variant={statusConfig.variant} className="rounded-lg">
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{new Date(device.estimatedDate).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

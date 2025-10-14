import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

  const getStatusVariant = (status: string) => {
    if (status === 'completed') return 'default';
    if (status === 'in_progress') return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="font-semibold">Devices in Repairing</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device ID</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-mono text-sm">{device.id}</TableCell>
                <TableCell className="font-medium">{device.deviceName}</TableCell>
                <TableCell>{device.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{device.issue}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(device.status)}>
                    {device.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{new Date(device.estimatedDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

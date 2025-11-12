import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X, Flashlight, FlashlightOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (barcode: string) => void;
}

export function BarcodeScannerDialog({
  open,
  onOpenChange,
  onScanSuccess,
}: BarcodeScannerDialogProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  useEffect(() => {
    if (open) {
      initializeScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [open]);

  const initializeScanner = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);
      
      const rearCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
      );
      
      const cameraToUse = rearCamera || devices[0];
      if (cameraToUse) {
        setSelectedCamera(cameraToUse.id);
      }
    } catch (error) {
      console.error("Error getting cameras:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const startScanner = async () => {
    if (!selectedCamera) {
      toast({
        title: "No Camera",
        description: "No camera available",
        variant: "destructive",
      });
      return;
    }

    try {
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          toast({
            title: "Barcode Scanned",
            description: `Code: ${decodedText}`,
          });
          stopScanner();
          onOpenChange(false);
        },
        () => {
        }
      );

      setIsScanning(true);
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      toast({
        title: "Scanner Error",
        description: error.message || "Failed to start scanner",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
        setTorchEnabled(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const toggleTorch = async () => {
    if (scannerRef.current && isScanning) {
      try {
        const track = scannerRef.current.getRunningTrackCameraCapabilities();
        if ((track as any).torch) {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ torch: !torchEnabled } as any],
          });
          setTorchEnabled(!torchEnabled);
        } else {
          toast({
            title: "Flashlight Error",
            description: "Flashlight not supported on this device",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Flashlight Error",
          description: "Flashlight not supported on this device",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <DialogDescription>
            Point your camera at a barcode to scan it
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            id="barcode-reader"
            className="w-full rounded-md overflow-hidden bg-muted"
            style={{ minHeight: isScanning ? "300px" : "0" }}
          />

          {!isScanning && cameras.length > 0 && (
            <div className="space-y-3">
              {cameras.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Camera</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    data-testid="select-camera"
                  >
                    {cameras.map((camera) => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label || `Camera ${camera.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button
                onClick={startScanner}
                className="w-full"
                data-testid="button-start-scanner"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Scanner
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="flex gap-2">
              <Button
                onClick={toggleTorch}
                variant="outline"
                className="flex-1"
                data-testid="button-toggle-torch"
              >
                {torchEnabled ? (
                  <FlashlightOff className="w-4 h-4 mr-2" />
                ) : (
                  <Flashlight className="w-4 h-4 mr-2" />
                )}
                {torchEnabled ? "Flash Off" : "Flash On"}
              </Button>
              <Button
                onClick={() => {
                  stopScanner();
                  onOpenChange(false);
                }}
                variant="destructive"
                className="flex-1"
                data-testid="button-stop-scanner"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          {!isScanning && cameras.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No cameras detected</p>
              <p className="text-xs mt-1">
                Please check camera permissions in your browser settings
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

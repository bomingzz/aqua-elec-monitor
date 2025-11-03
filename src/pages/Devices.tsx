import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, MapPin, Power, Plug, AirVent, Lightbulb, Thermometer, Monitor } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import floorplanImage from "@/assets/floorplan.png";

type DeviceType = "all" | "air-conditioner" | "switch" | "sensor" | "light" | "led-screen";
type DeviceStatus = "on" | "off" | "offline";

interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  power?: string;
  area: string;
}

const Devices = () => {
  const [selectedArea, setSelectedArea] = useState("余杭未来科技/移动通讯大楼");
  const [floorplanOpen, setFloorplanOpen] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "on" | "offline">("all");
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchAction, setBatchAction] = useState<"on" | "off">("on");
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);

  const [devices] = useState<IoTDevice[]>([
    { id: "1", name: "智能插座3E", type: "switch", status: "on", area: "办公区A" },
    { id: "2", name: "智能插座3B", type: "switch", status: "on", area: "办公区B" },
    { id: "3", name: "会议室空调", type: "air-conditioner", status: "on", power: "2500W", area: "办公区C" },
    { id: "4", name: "走廊灯", type: "light", status: "off", area: "办公区D" },
    { id: "5", name: "温度传感器", type: "sensor", status: "on", power: "5W", area: "办公区A" },
    { id: "6", name: "办公室空调A1", type: "air-conditioner", status: "on", power: "3000W", area: "办公区A" },
    { id: "7", name: "LED显示屏", type: "led-screen", status: "on", area: "办公区B" },
    { id: "8", name: "智能插座5C", type: "switch", status: "offline", area: "办公区C" },
  ]);

  const deviceTypes = [
    { id: "all", label: "全部", icon: Power },
    { id: "air-conditioner", label: "空调", icon: AirVent },
    { id: "switch", label: "开关", icon: Plug },
    { id: "sensor", label: "传感器", icon: Thermometer },
    { id: "light", label: "灯光", icon: Lightbulb },
    { id: "led-screen", label: "LED屏", icon: Monitor },
  ];

  const areas = ["办公区A", "办公区B", "办公区C", "办公区D"];

  const getFilteredDevices = () => {
    return devices.filter(device => {
      const typeMatch = deviceTypeFilter === "all" || device.type === deviceTypeFilter;
      const statusMatch = statusFilter === "all" || device.status === statusFilter;
      const areaMatch = selectedAreas.length === 0 || selectedAreas.includes(device.area);
      return typeMatch && statusMatch && areaMatch;
    });
  };

  const filteredDevices = getFilteredDevices();
  const totalDevices = filteredDevices.length;
  const onDevices = filteredDevices.filter(d => d.status === "on").length;
  const offlineDevices = filteredDevices.filter(d => d.status === "offline").length;

  const getDeviceIcon = (type: DeviceType) => {
    const iconMap = {
      "all": Power,
      "air-conditioner": AirVent,
      "switch": Plug,
      "sensor": Thermometer,
      "light": Lightbulb,
      "led-screen": Monitor,
    };
    return iconMap[type] || Power;
  };

  const handleFloorplanConfirm = () => {
    setFloorplanOpen(false);
    toast.success(`已选择 ${selectedAreas.length} 个区域`);
  };

  const toggleAreaSelection = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleBatchControl = (action: "on" | "off") => {
    setBatchAction(action);
    setBatchDialogOpen(true);
  };

  const confirmBatchControl = () => {
    toast.success(`已${batchAction === "on" ? "开启" : "关闭"} ${filteredDevices.length} 个设备`);
    setBatchDialogOpen(false);
  };

  const handleDeviceControl = (device: IoTDevice) => {
    setSelectedDevice(device);
    setControlDialogOpen(true);
  };

  const confirmDeviceControl = () => {
    if (selectedDevice) {
      if (selectedDevice.status === "offline") {
        toast.error("操作失败，设备已离线");
      } else {
        const newStatus = selectedDevice.status === "on" ? "off" : "on";
        toast.success(`已${newStatus === "on" ? "开启" : "关闭"}设备`);
      }
    }
    setControlDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Location & Floorplan */}
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-lg font-semibold">
              <span>{selectedArea}</span>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </button>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              onClick={() => setFloorplanOpen(true)}
            >
              <MapPin className="w-4 h-4" />
              平面图
            </Button>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStatusFilter("all")}
          >
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold">{totalDevices}</div>
              <div className="text-sm text-muted-foreground mt-1">设备总数</div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStatusFilter("on")}
          >
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold">{onDevices}</div>
              <div className="text-sm text-muted-foreground mt-1">开启设备</div>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStatusFilter("offline")}
          >
            <CardContent className="pt-4 text-center">
              <div className="text-3xl font-bold text-destructive">{offlineDevices}</div>
              <div className="text-sm text-muted-foreground mt-1">离线设备</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Device Type Filter */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {deviceTypes.map((type) => {
            const Icon = type.icon;
            const isActive = deviceTypeFilter === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setDeviceTypeFilter(type.id as DeviceType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch Control */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default"
            className="gap-2"
            onClick={() => handleBatchControl("on")}
          >
            全部开启
            <span className="font-bold">ON</span>
          </Button>
          <Button 
            variant="destructive"
            className="gap-2"
            onClick={() => handleBatchControl("off")}
          >
            全部关闭
            <span className="font-bold">OFF</span>
          </Button>
        </div>
      </div>

      {/* Device List */}
      <div className="px-4 space-y-3">
        {filteredDevices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          const isOn = device.status === "on";
          const isOffline = device.status === "offline";
          
          return (
            <Card key={device.id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isOffline ? "bg-muted" : "bg-primary/10"
                  }`}>
                    <DeviceIcon className={`w-6 h-6 ${
                      isOffline ? "text-muted-foreground" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{device.name}</div>
                    {device.power && (
                      <div className="text-xs text-muted-foreground">
                        功率：{device.power}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeviceControl(device)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isOffline 
                        ? "bg-muted text-muted-foreground" 
                        : isOn
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floorplan Dialog */}
      <Dialog open={floorplanOpen} onOpenChange={setFloorplanOpen}>
        <DialogContent className="max-w-[90vw] max-h-[80vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>请选择区域</DialogTitle>
          </DialogHeader>
          <div className="p-4 overflow-auto">
            <div className="relative">
              <img 
                src={floorplanImage} 
                alt="Floor Plan" 
                className="w-full h-auto"
              />
            </div>
            <div className="mt-4 space-y-2">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => toggleAreaSelection(area)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    selectedAreas.includes(area)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="font-medium">{area}</span>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter className="p-4 pt-2">
            <Button variant="outline" onClick={() => setFloorplanOpen(false)}>
              取消
            </Button>
            <Button onClick={handleFloorplanConfirm}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Control Confirmation */}
      <AlertDialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量操作</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要{batchAction === "on" ? "开启" : "关闭"}筛选出的 {filteredDevices.length} 个设备吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBatchControl}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Device Control Dialog */}
      <AlertDialog open={controlDialogOpen} onOpenChange={setControlDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认操作</AlertDialogTitle>
            <AlertDialogDescription>
              确定要{selectedDevice?.status === "on" ? "关闭" : "开启"}"{selectedDevice?.name}"吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeviceControl}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Devices;

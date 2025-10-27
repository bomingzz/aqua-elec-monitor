import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, RefreshCw, Zap, Droplets, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
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

type DeviceType = "electric" | "water";
type ValveStatus = "open" | "closed";
type NetworkStatus = "online" | "offline";

interface ElectricMeter {
  id: string;
  name: string;
  location: string;
  account: string;
  total: number | "unknown";
  peak: number | "unknown";
  flat: number | "unknown";
  valley: number | "unknown";
  valveStatus: ValveStatus;
  networkStatus: NetworkStatus;
  updateTime: string;
}

interface WaterMeter {
  id: string;
  name: string;
  location: string;
  account: string;
  reading: number | "unknown";
  sn: string;
  valveStatus: ValveStatus;
  networkStatus: NetworkStatus;
  updateTime: string;
}

const Devices = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>("electric");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [actionType, setActionType] = useState<"open" | "close">("close");

  const [electricMeters] = useState<ElectricMeter[]>([
    {
      id: "1",
      name: "钉钉POC-三相主机电表",
      location: "7楼/7展厅",
      account: "钉钉智能硬件体验中心",
      total: 2500.5,
      peak: 1200.1,
      flat: 800.2,
      valley: 500.2,
      valveStatus: "closed",
      networkStatus: "offline",
      updateTime: "10-27 10:05",
    },
    {
      id: "2",
      name: "电表-A101",
      location: "1楼/大厅",
      account: "主楼管理处",
      total: 1850.3,
      peak: 950.5,
      flat: 600.8,
      valley: 299.0,
      valveStatus: "open",
      networkStatus: "online",
      updateTime: "10-27 10:30",
    },
  ]);

  const [waterMeters] = useState<WaterMeter[]>([
    {
      id: "1",
      name: "144-模拟水表",
      location: "7楼/7展厅",
      account: "钉钉智能硬件体验中心",
      reading: 123.5,
      sn: "1859778338285123728",
      valveStatus: "closed",
      networkStatus: "online",
      updateTime: "10-27 10:05",
    },
    {
      id: "2",
      name: "水表-B205",
      location: "2楼/办公区",
      account: "办公楼管理处",
      reading: "unknown",
      sn: "1859778338285123729",
      valveStatus: "open",
      networkStatus: "offline",
      updateTime: "离线未知",
    },
  ]);

  const handleRefresh = (deviceId: string) => {
    toast.success("读数已刷新");
  };

  const handleValveAction = (device: any, action: "open" | "close") => {
    setSelectedDevice(device);
    setActionType(action);
    setDialogOpen(true);
  };

  const confirmValveAction = () => {
    toast.success(actionType === "open" ? "已开闸" : "已关闸");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold mb-3">设备管理</h1>
          <Tabs value={deviceType} onValueChange={(v) => setDeviceType(v as DeviceType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="electric">电表</TabsTrigger>
              <TabsTrigger value="water">水表</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Filter */}
      <div className="px-4 py-4">
        <Button variant="outline" className="gap-2 w-full justify-start">
          <Filter className="w-4 h-4" />
          筛选条件
        </Button>
      </div>

      {/* Device List */}
      <div className="px-4 space-y-3">
        {deviceType === "electric" ? (
          electricMeters.map((meter) => (
            <Card key={meter.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground">{meter.account}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {meter.location}/{meter.name}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">总</div>
                    <div className="font-semibold">
                      {meter.total === "unknown" ? "离线未知" : `${meter.total} 度`}
                    </div>
                    {meter.total !== "unknown" && (
                      <div className="text-xs text-muted-foreground">{meter.updateTime}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">峰</div>
                    <div className="font-semibold">
                      {meter.peak === "unknown" ? "离线未知" : `${meter.peak} 度`}
                    </div>
                    {meter.peak !== "unknown" && (
                      <div className="text-xs text-muted-foreground">{meter.updateTime}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">平</div>
                    <div className="font-semibold">
                      {meter.flat === "unknown" ? "离线未知" : `${meter.flat} 度`}
                    </div>
                    {meter.flat !== "unknown" && (
                      <div className="text-xs text-muted-foreground">{meter.updateTime}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">谷</div>
                    <div className="font-semibold">
                      {meter.valley === "unknown" ? "离线未知" : `${meter.valley} 度`}
                    </div>
                    {meter.valley !== "unknown" && (
                      <div className="text-xs text-muted-foreground">{meter.updateTime}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">阀门:</span>
                    <Badge variant={meter.valveStatus === "open" ? "default" : "destructive"} className="text-xs">
                      {meter.valveStatus === "open" ? "拉闸" : "关闸"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">网络:</span>
                    <Badge variant={meter.networkStatus === "online" ? "default" : "secondary"} className="text-xs">
                      {meter.networkStatus === "online" ? "在线" : "离线"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 flex-1"
                    onClick={() => handleRefresh(meter.id)}
                  >
                    <RefreshCw className="w-4 h-4" />
                    刷新读数
                  </Button>
                  <Button 
                    size="sm" 
                    variant={meter.valveStatus === "open" ? "destructive" : "default"}
                    onClick={() => handleValveAction(meter, meter.valveStatus === "open" ? "close" : "open")}
                  >
                    {meter.valveStatus === "open" ? "关闸" : "开闸"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          waterMeters.map((meter) => (
            <Card key={meter.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-foreground">{meter.account}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {meter.location}/{meter.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">读数</div>
                    <div className="font-semibold">
                      {meter.reading === "unknown" ? "离线未知" : `${meter.reading} 吨`}
                    </div>
                    {meter.reading !== "unknown" && (
                      <div className="text-xs text-muted-foreground">{meter.updateTime}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    SN: {meter.sn}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">阀门:</span>
                    <Badge variant={meter.valveStatus === "open" ? "default" : "destructive"} className="text-xs">
                      {meter.valveStatus === "open" ? "开阀" : "关阀"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">网络:</span>
                    <Badge variant={meter.networkStatus === "online" ? "default" : "secondary"} className="text-xs">
                      {meter.networkStatus === "online" ? "在线" : "离线"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 flex-1"
                    onClick={() => handleRefresh(meter.id)}
                  >
                    <RefreshCw className="w-4 h-4" />
                    刷新读数
                  </Button>
                  <Button 
                    size="sm" 
                    variant={meter.valveStatus === "open" ? "destructive" : "default"}
                    onClick={() => handleValveAction(meter, meter.valveStatus === "open" ? "close" : "open")}
                  >
                    {meter.valveStatus === "open" ? "关阀" : "开阀"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认操作</AlertDialogTitle>
            <AlertDialogDescription>
              确定要{actionType === "open" ? "开闸" : "关闸"}吗？此操作将立即生效。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmValveAction}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Devices;

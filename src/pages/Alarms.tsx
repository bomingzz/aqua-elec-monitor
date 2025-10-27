import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";

type AlarmStatus = "pending" | "processed" | "ignored";

interface Alarm {
  id: string;
  type: string;
  detail: string;
  device: string;
  account: string;
  time: string;
  status: AlarmStatus;
}

const Alarms = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"process" | "ignore">("process");
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [remark, setRemark] = useState("");

  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "1",
      type: "用量突增",
      detail: "连续3日用电量环比增长35%",
      device: "电表-A101",
      account: "张三",
      time: "2025-10-27 10:30:00",
      status: "pending",
    },
    {
      id: "2",
      type: "异常用水",
      detail: "夜间用水量异常，超过正常水平50%",
      device: "水表-B205",
      account: "李四",
      time: "2025-10-27 09:15:00",
      status: "pending",
    },
    {
      id: "3",
      type: "设备离线",
      detail: "设备连续12小时未上报数据",
      device: "电表-C303",
      account: "王五",
      time: "2025-10-27 08:00:00",
      status: "processed",
    },
  ]);

  const metrics = {
    pending: alarms.filter(a => a.status === "pending").length,
    todayNew: alarms.filter(a => a.time.includes("2025-10-27")).length,
    todayProcessed: alarms.filter(a => 
      a.time.includes("2025-10-27") && (a.status === "processed" || a.status === "ignored")
    ).length,
  };

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(selectedMetric === metric ? null : metric);
  };

  const handleAction = (alarm: Alarm, type: "process" | "ignore") => {
    setSelectedAlarm(alarm);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedAlarm) return;

    const newStatus = dialogType === "process" ? "processed" : "ignored";
    setAlarms(alarms.map(a => 
      a.id === selectedAlarm.id ? { ...a, status: newStatus } : a
    ));

    toast.success(dialogType === "process" ? "告警已处理" : "告警已忽略");
    setDialogOpen(false);
    setRemark("");
    setSelectedAlarm(null);
  };

  const getStatusColor = (status: AlarmStatus) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "processed":
        return "default";
      case "ignored":
        return "secondary";
    }
  };

  const getStatusText = (status: AlarmStatus) => {
    switch (status) {
      case "pending":
        return "待处理";
      case "processed":
        return "已处理";
      case "ignored":
        return "已忽略";
    }
  };

  const filteredAlarms = selectedMetric 
    ? alarms.filter(a => {
        if (selectedMetric === "pending") return a.status === "pending";
        if (selectedMetric === "todayNew") return a.time.includes("2025-10-27");
        if (selectedMetric === "todayProcessed") return a.time.includes("2025-10-27") && (a.status === "processed" || a.status === "ignored");
        return true;
      })
    : alarms;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm px-4 py-4">
        <h1 className="text-xl font-bold">异常告警</h1>
      </header>

      {/* Metrics */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <Card 
            className={`cursor-pointer transition-all ${selectedMetric === "pending" ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleMetricClick("pending")}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-destructive">{metrics.pending}</div>
              <div className="text-sm text-muted-foreground mt-1">待处理</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${selectedMetric === "todayNew" ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleMetricClick("todayNew")}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{metrics.todayNew}</div>
              <div className="text-sm text-muted-foreground mt-1">今日新增</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${selectedMetric === "todayProcessed" ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleMetricClick("todayProcessed")}
          >
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-success">{metrics.todayProcessed}</div>
              <div className="text-sm text-muted-foreground mt-1">今日已处理</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="px-4 pb-4 flex gap-2">
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          筛选
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="搜索告警..." 
            className="w-full h-10 pl-10 pr-4 rounded-md border bg-background"
          />
        </div>
      </div>

      {/* Alarm List */}
      <div className="px-4 space-y-3">
        {filteredAlarms.map((alarm) => (
          <Card key={alarm.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="text-xs">{alarm.type}</Badge>
                <Badge variant={getStatusColor(alarm.status)} className="text-xs">
                  {getStatusText(alarm.status)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="font-semibold text-foreground">{alarm.detail}</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>关联设备：{alarm.device}</div>
                  <div>账户名称：{alarm.account}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <span className="text-xs text-muted-foreground">{alarm.time}</span>
                {alarm.status === "pending" && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleAction(alarm, "process")}
                    >
                      处理
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction(alarm, "ignore")}
                    >
                      忽略
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogType === "process" ? "处理告警" : "忽略告警"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">备注</label>
            <Textarea 
              placeholder={dialogType === "process" ? "请输入处理说明..." : "请输入忽略原因..."}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirm}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Alarms;

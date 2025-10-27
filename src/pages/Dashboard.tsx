import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { ChevronDown, Zap, Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { SankeyChart } from "@/components/SankeyChart";

type TimeRange = "day" | "month" | "year";
type EnergyType = "electric" | "water";
type DistributionBy = "area" | "account";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [energyType, setEnergyType] = useState<EnergyType>("electric");
  const [distributionBy, setDistributionBy] = useState<DistributionBy>("area");

  // Mock data for trend chart
  const trendData = [
    { name: "3", value: 0 },
    { name: "6", value: 0 },
    { name: "9", value: 0 },
    { name: "12", value: 250 },
    { name: "15", value: 700 },
    { name: "18", value: 500 },
    { name: "21", value: 650 },
    { name: "24", value: 200 },
    { name: "27", value: 0 },
    { name: "30", value: 0 },
  ];

  // Mock data for distribution
  const distributionData = [
    { name: "教学", value: 450, percent: 35, change: 5.8, color: "#3b82f6" },
    { name: "住宿", value: 320, percent: 25, change: -2.1, color: "#f59e0b" },
    { name: "餐饮", value: 200, percent: 16, change: 3.2, color: "#a855f7" },
    { name: "行政", value: 150, percent: 12, change: -1.5, color: "#ec4899" },
    { name: "公区", value: 100, percent: 8, change: 0.8, color: "#10b981" },
    { name: "地下室", value: 40, percent: 3, change: 1.2, color: "#06b6d4" },
    { name: "体育场", value: 15, percent: 1, change: -0.5, color: "#f97316" },
  ];

  // Sankey chart data
  const sankeyData = {
    nodes: [
      { name: "总用电量", color: "#3b82f6" },
      ...distributionData.map(d => ({ name: d.name, color: d.color }))
    ],
    links: distributionData.map((d, i) => ({
      source: 0,
      target: i + 1,
      value: d.value
    }))
  };

  // Mock data for usage analysis
  const usageAnalysisData = [
    { name: "教学", current: 500, previous: 450, change: 2.5 },
    { name: "住宿", current: 280, previous: 320, change: -1.8 },
    { name: "餐饮", current: 350, previous: 280, change: 3.2 },
    { name: "行政", current: 420, previous: 350, change: 1.5 },
    { name: "公区", current: 200, previous: 180, change: -0.5 },
    { name: "地下室", current: 150, previous: 120, change: 4.2 },
    { name: "体育场", current: 100, previous: 80, change: 0.8 },
  ];

  // Mock data for top 10
  const top10Data = [
    { rank: 1, name: "1号楼", value: 76 },
    { rank: 2, name: "5号楼", value: 67 },
    { rank: 3, name: "3号楼", value: 65 },
    { rank: 4, name: "2号楼", value: 53 },
    { rank: 5, name: "4号楼", value: 51 },
    { rank: 6, name: "7号楼", value: 48 },
    { rank: 7, name: "公区", value: 41 },
    { rank: 8, name: "13号楼", value: 39 },
    { rank: 9, name: "地下室", value: 35 },
    { rank: 10, name: "6号楼", value: 31 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Time Range Selector */}
      <header className="sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="px-4 py-3">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-10">
              <TabsTrigger value="day">当日统计</TabsTrigger>
              <TabsTrigger value="month">月统计</TabsTrigger>
              <TabsTrigger value="year">年统计</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {timeRange === "month" && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-lg font-semibold">2022.10</span>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Data Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">总用电量 (度)</div>
                <div className="text-3xl font-bold text-primary">1200</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">总用水量 (吨)</div>
                <div className="text-3xl font-bold text-primary">120</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">能耗趋势</CardTitle>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant={energyType === "electric" ? "default" : "outline"}
                onClick={() => setEnergyType("electric")}
              >
                用电
              </Button>
              <Button
                size="sm"
                variant={energyType === "water" ? "default" : "outline"}
                onClick={() => setEnergyType("water")}
              >
                用水
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">能耗分布</CardTitle>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={energyType === "electric" ? "default" : "outline"}
                  onClick={() => setEnergyType("electric")}
                >
                  用电
                </Button>
                <Button
                  size="sm"
                  variant={energyType === "water" ? "default" : "outline"}
                  onClick={() => setEnergyType("water")}
                >
                  用水
                </Button>
              </div>
              <Button size="sm" variant="ghost" className="gap-1">
                按{distributionBy === "area" ? "区域" : "账户"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <SankeyChart data={sankeyData} width={350} height={380} />
          </CardContent>
        </Card>

        {/* Usage Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">能耗用量分析</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">
              数据取自 2022.08 ~ 2022.09
            </div>
            <div className="flex items-center justify-between mt-3">
              <Tabs defaultValue="mom" className="w-fit">
                <TabsList className="h-9">
                  <TabsTrigger value="mom" className="text-xs">环比变化</TabsTrigger>
                  <TabsTrigger value="yoy" className="text-xs">同比变化</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button size="sm" variant="default">用电</Button>
                <Button size="sm" variant="outline">用水</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={usageAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis yAxisId="left" stroke="#6b7280" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="current" fill="#3b82f6" name="9月能耗" />
                <Bar yAxisId="left" dataKey="previous" fill="#60a5fa" name="8月能耗" />
                <Line yAxisId="right" type="monotone" dataKey="change" stroke="#f59e0b" strokeWidth={2} name="环比变化" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">能耗排行榜 Top 10</CardTitle>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="default">用电</Button>
              <Button size="sm" variant="outline">用水</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 text-xs text-muted-foreground pb-2 border-b">
                <span>排名</span>
                <span>空间</span>
                <span>用电量(度)</span>
              </div>
              {top10Data.map((item) => (
                <div key={item.rank} className="grid grid-cols-[auto_1fr_auto] gap-3 py-2 text-sm">
                  <span className={`font-semibold ${item.rank <= 3 ? 'text-primary' : 'text-foreground'}`}>
                    {item.rank}
                  </span>
                  <span className="text-foreground">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

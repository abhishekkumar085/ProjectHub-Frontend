import totalProjectsImg from "../../assets/Total Projects.png";
import activeProjectsImg from "../../assets/Active Projects.png";
import completedProjectsImg from "../../assets/Completed Projects.png";
import totalIcon from "../../assets/Total.png";
import activeIcon from "../../assets/Active.png";
import completedIcon from "../../assets/Completed.png";
import { useEffect, useState } from "react";
import { getDashboardApi } from "./dashboardapi";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface KpiTile {
  label: string;
  value: number | string;
  img: string;
  circleIcon: string;
  gradient: string;
}

interface GraphItem {
  month: string;
  active: number;
  completed: number;
}

interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  graphData: GraphItem[];
}

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const stats: KpiTile[] = [
    {
      label: "Total Projects",
      value: dashboard?.totalProjects || 0,
      img: totalProjectsImg,
      circleIcon: totalIcon,
      gradient: "linear-gradient(90deg, #0059FF 0%, #003699 100%)",
    },
    {
      label: "Active Projects",
      value: dashboard?.activeProjects || 0,
      img: activeProjectsImg,
      circleIcon: activeIcon,
      gradient: "linear-gradient(180deg, #252D9E 0%, #0D1038 100%)",
    },
    {
      label: "Completed Projects",
      value: dashboard?.completedProjects || 0,
      img: completedProjectsImg,
      circleIcon: completedIcon,
      gradient: "linear-gradient(180deg, #4D3190 0%, #1B084A 100%)",
    },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardApi();
        setDashboard(data);
      } catch (error) {
        console.error("Dashboard API Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-[#00076F] font-[Poppins]">Loading Dashboard...</div>;
  }

  const graphData = dashboard?.graphData ?? [];

  const maxVal = Math.max(
    ...graphData.map((d) => Math.max(d.active, d.completed)),
    4
  );

  return (
    <div className="p-4 sm:p-6">

      {/* Welcome Section */}
      <h2 className="text-lg sm:text-xl font-semibold text-[#00076F] font-[Poppins]">
        Dashboard
      </h2>

      {/* KPI Section */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{ background: stat.gradient }}
            className="relative overflow-hidden rounded-2xl p-5 sm:p-7 text-white shadow-lg"
          >
            <img
              src={stat.img}
              alt=""
              className="pointer-events-none absolute -left-2 top-1/2 h-32 w-32 -translate-y-1/2 object-contain"
              style={{ padding: "8px", marginLeft: "18px" }}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-semibold text-white font-[Poppins]">
                  {stat.label}
                </span>
                <span className="mt-2 sm:mt-[14px] text-3xl sm:text-4xl font-semibold text-white font-[Poppins]">
                  {stat.value}
                </span>
              </div>
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-white">
                <img
                  src={stat.circleIcon}
                  alt={stat.label}
                  className="h-6 w-6 object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPH SECTION */}
     <div className="mt-5 rounded-[16px] bg-white border border-[#ECECEC] px-5 py-4 shadow-sm">

  {/* TITLE */}

  <h3 className="text-[18px] font-semibold text-[#1E1E1E] font-[Poppins] mb-4">
    Projects Insights
  </h3>

  {/* CHART */}

  <div className="w-full overflow-x-auto">

    <LineChart
      width={980}
      height={250}
      data={graphData}
      margin={{
        top: 5,
        right: 10,
        left: -20,
        bottom: 10,
      }}
    >

      {/* GRID */}

      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#E5E7EB"
        vertical={true}
      />

      {/* X AXIS */}

      <XAxis
        dataKey="month"
        tick={{
          fill: "#9CA3AF",
          fontSize: 11,
          fontFamily: "Poppins",
        }}
        axisLine={false}
        tickLine={false}
      />

      {/* Y AXIS */}

      <YAxis
        domain={[0, maxVal + 1]}
        allowDecimals={false}
        tick={{
          fill: "#9CA3AF",
          fontSize: 11,
          fontFamily: "Poppins",
        }}
        axisLine={false}
        tickLine={false}
      />

      {/* TOOLTIP */}

      <Tooltip
        contentStyle={{
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          fontSize: "12px",
          fontFamily: "Poppins",
        }}
      />

      {/* LEGEND */}

      <Legend
        verticalAlign="bottom"
        align="center"
        iconType="circle"
        wrapperStyle={{
          paddingTop: "8px",
          fontSize: "12px",
          fontFamily: "Poppins",
        }}
      />

      {/* ACTIVE */}

      <Line
        type="monotone"
        dataKey="active"
        stroke="#22C55E"
        strokeWidth={1.8}
        dot={{
          r: 3,
          fill: "#fff",
          stroke: "#22C55E",
          strokeWidth: 1.5,
        }}
        activeDot={{
          r: 5,
        }}
        name="Active"
      />

      {/* COMPLETED */}

      <Line
        type="monotone"
        dataKey="completed"
        stroke="#FF4D4F"
        strokeWidth={1.8}
        dot={{
          r: 3,
          fill: "#fff",
          stroke: "#FF4D4F",
          strokeWidth: 1.5,
        }}
        activeDot={{
          r: 5,
        }}
        name="Completed"
      />

    </LineChart>

  </div>

</div>
        </div>

      

    
  );
}

export default Dashboard;

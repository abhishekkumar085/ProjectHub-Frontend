import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFolder,
  FiUsers,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi";

interface KpiTile {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

interface WelcomeCard {
  key: "projects" | "team" | "insights";
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  route?: string;
  disabled?: boolean;
}

function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);

      setUserName(
     
          parsedUser?.name ||
          parsedUser?.sub ||
          ""
      );
    }
  }, []);

  const stats: KpiTile[] = [
    {
      label: "Active Projects",
      value: 5,
      icon: <FiFolder size={22} />,
    },
    {
      label: "Team Members",
      value: 1,
      icon: <FiUsers size={22} />,
    },
    {
      label: "Updates This Week",
      value: 0,
      icon: <FiActivity size={22} />,
    },
  ];

  const cards: WelcomeCard[] = [
    {
      key: "projects",
      icon: <FiFolder size={24} />,
      title: "Projects",
      body: "Track everything you and your team are working on.",
      cta: "Open Projects",
      route: "/projects",
    },
    {
      key: "team",
      icon: <FiUsers size={24} />,
      title: "Team",
      body: "Coming soon — invite members and assign work.",
      cta: "Coming Soon",
      disabled: true,
    },
    {
      key: "insights",
      icon: <FiBarChart2 size={24} />,
      title: "Insights",
      body: "Coming soon — analytics across all your projects.",
      cta: "Coming Soon",
      disabled: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="mb-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome{userName ? `, ${userName}` : ""}
        </h2>

        <p className="text-sm text-slate-500">
          Here's a quick overview of your Project Hub workspace.
        </p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </span>

                <span className="mt-2 text-4xl font-bold text-slate-900">
                  {stat.value}
                </span>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.key}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {/* Icon */}
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full
              ${
                card.key === "projects"
                  ? "bg-blue-100 text-blue-600"
                  : card.key === "team"
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {card.icon}
            </div>

            {/* Content */}
            <h4 className="mb-2 text-lg font-semibold text-slate-900">
              {card.title}
            </h4>

            <p className="mb-6 flex-1 text-sm leading-6 text-slate-500">
              {card.body}
            </p>

            {/* CTA */}
            {card.disabled ? (
              <button
                disabled
                className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500"
              >
                {card.cta}
              </button>
            ) : (
              <Link
                to={card.route || "#"}
                className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {card.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
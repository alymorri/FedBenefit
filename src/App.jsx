import { EligibilityAuditTool } from "./components/eligibility-audit-tool";
import { useState, useEffect } from "react";

function App() {
  const [locationInfo, setLocationInfo] = useState({
    city: "Washington",
    state: "D.C.",
    loading: true,
  });

  useEffect(() => {
    // Fetch user location based on IP
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setLocationInfo({
          city: data.city || "Washington",
          state: data.region_code || "D.C.",
          loading: false,
        });
      })
      .catch(() => {
        setLocationInfo({
          city: "Washington",
          state: "D.C.",
          loading: false,
        });
      });
  }, []);

  const formatDate = () => {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return now.toLocaleDateString("en-US", options);
  };

  const getDeadline = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const dateStr = now.toLocaleDateString("en-US", options);
    return `${dateStr} 11:59PM ET`;
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-background px-4">
        <div className="w-full max-w-5xl mx-auto">
          {/* Top header with location and date */}
          <div className="w-full border-b border-border py-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">
                  {locationInfo.loading ? "Loading..." : `${locationInfo.city}, ${locationInfo.state}`}
                </span>
                <span>•</span>
                <span>{formatDate()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-bold text-xs">LIVE</span>
              </div>
            </div>
          </div>

          {/* Main branding header */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FB</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary">FedBenefit</h1>
                  <p className="text-xs text-muted-foreground">Independent Policy Analysis</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-destructive">Deadline: {getDeadline()}</p>
              </div>
            </div>
          </div>

          {/* Eligibility tool */}
          <div className="w-full max-w-2xl mx-auto">
            <EligibilityAuditTool />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

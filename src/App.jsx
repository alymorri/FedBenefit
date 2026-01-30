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
      <main className="flex min-h-screen flex-col items-center bg-background">
        <div className="w-full">
          {/* Top header with location and date */}
          <div className="w-full border-b border-border bg-white">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-normal">
                    {locationInfo.loading ? "Loading..." : `${locationInfo.city}, ${locationInfo.state}`}
                  </span>
                  <span>•</span>
                  <span className="font-normal">{formatDate()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-bold text-xs tracking-wide">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main branding header */}
          <div className="w-full bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-primary rounded-sm flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xl">FB</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-primary leading-none mb-1">FedBenefit</h1>
                    <p className="text-sm text-muted-foreground">Independent Policy Analysis</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-destructive">Deadline: {getDeadline()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility tool */}
          <div className="w-full max-w-7xl mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <EligibilityAuditTool />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

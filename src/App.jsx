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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <span className="font-normal">
                    {locationInfo.loading ? "Loading..." : `${locationInfo.city}, ${locationInfo.state}`}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-normal hidden sm:inline">{formatDate()}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-bold text-xs tracking-wide">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main branding header */}
          <div className="w-full bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-sm flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-lg sm:text-xl">FB</span>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-4xl font-bold text-primary leading-none mb-0.5 sm:mb-1">FedBenefit</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Independent Policy Analysis</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-base font-semibold text-destructive leading-tight whitespace-nowrap">
                    <span className="block sm:inline">Deadline:</span> <span className="block sm:inline">{getDeadline()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility tool */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
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

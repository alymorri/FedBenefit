"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  FileCheck,
  BadgeCheck,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/progress-bar";
import { CheckingAnimation } from "@/components/checking-animation";
import { MoneyAnimation } from "@/components/money-animation";
import { CountdownTimer } from "@/components/countdown-timer";

export function EligibilityAuditTool() {
  // ZIP code to location mapping - only include exact matches we're confident about
  const zipCodeData = {
    // New York
    10001: { state: "NY" },
    10016: { state: "NY" },
    11201: { state: "NY" },
    // California
    90001: { state: "CA" },
    90210: { state: "CA" },
    94016: { state: "CA" },
    // Illinois
    60601: { state: "IL" },
    60614: { state: "IL" },
    // Texas
    75001: { state: "TX" },
    77001: { state: "TX" },
    // Florida
    33101: { state: "FL" },
    32801: { state: "FL" },
    // More states
    "02108": { state: "MA" }, // Boston
    20001: { state: "DC" }, // Washington DC
    80201: { state: "CO" }, // Denver
    98101: { state: "WA" }, // Seattle
    97201: { state: "OR" }, // Portland
    89101: { state: "NV" }, // Las Vegas
    85001: { state: "AZ" }, // Phoenix
    48201: { state: "MI" }, // Detroit
    30301: { state: "GA" }, // Atlanta
    37201: { state: "TN" }, // Nashville
    70112: { state: "LA" }, // New Orleans
    55401: { state: "MN" }, // Minneapolis
  };

  // Function to get state from ZIP code - only returns a result if we're confident
  const getStateFromZip = (zip) => {
    // If we have exact data for this ZIP
    if (zipCodeData[zip]) {
      return zipCodeData[zip].state;
    }
    return null;
  };

  // Convert state name to demonym (e.g., "California" -> "Californians")
  const getStateDemonym = (stateName) => {
    const demonyms = {
      Alabama: "Alabamians",
      Alaska: "Alaskans",
      Arizona: "Arizonans",
      Arkansas: "Arkansans",
      California: "Californians",
      Colorado: "Coloradans",
      Connecticut: "Connecticuters",
      Delaware: "Delawareans",
      Florida: "Floridians",
      Georgia: "Georgians",
      Hawaii: "Hawaiians",
      Idaho: "Idahoans",
      Illinois: "Illinoisans",
      Indiana: "Hoosiers",
      Iowa: "Iowans",
      Kansas: "Kansans",
      Kentucky: "Kentuckians",
      Louisiana: "Louisianans",
      Maine: "Mainers",
      Maryland: "Marylanders",
      Massachusetts: "Massachusetts residents",
      Michigan: "Michiganders",
      Minnesota: "Minnesotans",
      Mississippi: "Mississippians",
      Missouri: "Missourians",
      Montana: "Montanans",
      Nebraska: "Nebraskans",
      Nevada: "Nevadans",
      "New Hampshire": "New Hampshirites",
      "New Jersey": "New Jerseyans",
      "New Mexico": "New Mexicans",
      "New York": "New Yorkers",
      "North Carolina": "North Carolinians",
      "North Dakota": "North Dakotans",
      Ohio: "Ohioans",
      Oklahoma: "Oklahomans",
      Oregon: "Oregonians",
      Pennsylvania: "Pennsylvanians",
      "Rhode Island": "Rhode Islanders",
      "South Carolina": "South Carolinians",
      "South Dakota": "South Dakotans",
      Tennessee: "Tennesseans",
      Texas: "Texans",
      Utah: "Utahns",
      Vermont: "Vermonters",
      Virginia: "Virginians",
      Washington: "Washingtonians",
      "West Virginia": "West Virginians",
      Wisconsin: "Wisconsinites",
      Wyoming: "Wyomingites",
      "D.C.": "D.C. residents",
      "District of Columbia": "D.C. residents",
    };
    return demonyms[stateName] || "Americans";
  };

  const [currentStep, setCurrentStep] = useState("rebate-check");
  const [userState, setUserState] = useState("Americans");
  const [answers, setAnswers] = useState({
    rebateClaimed: "",
    zipCode: "",
    state: "",
    assistancePrograms: ["None of the above"],
    flowPath: "standard",
  });
  const [progress, setProgress] = useState(0);
  const [showTextBubble, setShowTextBubble] = useState(false);
  const [caseId] = useState(
    `RR-${Math.floor(1000 + Math.random() * 9000)}-HHS`
  );
  const [expiryDate] = useState(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    return date;
  });

  // Fetch user's state from IP on component mount
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        const stateName = data.region || "";
        const demonym = getStateDemonym(stateName);
        setUserState(demonym);
      })
      .catch(() => {
        setUserState("Americans");
      });
  }, []);

  useEffect(() => {
    // Create the script element
    const script = document.createElement("script");
    script.src = "//b-js.ringba.com/CAee32d1d310d14e3bbac57842d7848265";
    script.async = true;

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);



  // Update progress based on current step
  useEffect(() => {
    const stepToProgress = {
      "rebate-check": 0,
      "checking-records": 20,
      "grocery-card-offer": 20,
      location: 40,
      assistance: 60,
      "assistance-alt": 60,
      "checking-assistance": 100,
      results: 100,
      "results-grocery": 100,
      "results-agent": 100,
    };

    setProgress(stepToProgress[currentStep]);
  }, [currentStep]);

  // Show text bubble after checking records
  useEffect(() => {
    if (currentStep === "checking-records") {
      const timer = setTimeout(() => {
        setShowTextBubble(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  // Determine which results page to show based on user selections
  const shouldShowGroceryPath = () => {
    return (
      answers.assistancePrograms.includes("Medicaid") ||
      answers.assistancePrograms.includes("Medicare")
    );
  };

  // Handle rebate check answer
  const handleRebateAnswer = (answer) => {
    setAnswers({ ...answers, rebateClaimed: answer });

    if (answer === "Yes") {
      // If they've already received it, go to grocery card offer
      setCurrentStep("grocery-card-offer");
    } else {
      // Otherwise follow the standard flow
      setCurrentStep("checking-records");

      // Simulate checking and move to next step
      setTimeout(() => {
        setCurrentStep("location");
      }, 2500);
    }
  };

  // Handle grocery card offer
  const handleGroceryCardOffer = () => {
    setAnswers({ ...answers, flowPath: "grocery" });
    setCurrentStep("assistance-alt");
  };

  // Handle zip code submission
  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (answers.zipCode.length === 5) {
      setCurrentStep("assistance");
    }
  };

  // Handle assistance program selection
  const handleAssistanceSelect = (program) => {
    const updatedPrograms = [...answers.assistancePrograms];

    if (program === "None of the above") {
      if (updatedPrograms.includes(program)) {
        return;
      } else {
        setAnswers({ ...answers, assistancePrograms: ["None of the above"] });
        return;
      }
    } else {
      const withoutNone = updatedPrograms.filter(
        (p) => p !== "None of the above"
      );

      if (withoutNone.includes(program)) {
        const index = withoutNone.indexOf(program);
        withoutNone.splice(index, 1);

        if (withoutNone.length === 0) {
          setAnswers({ ...answers, assistancePrograms: ["None of the above"] });
          return;
        }
      } else {
        withoutNone.push(program);
      }

      setAnswers({ ...answers, assistancePrograms: withoutNone });
    }
  };

  // Handle assistance submission
  const handleAssistanceSubmit = () => {
    setCurrentStep("checking-assistance");

    setTimeout(() => {
      if (answers.flowPath === "grocery") {
        if (
          answers.assistancePrograms.includes("Medicaid") ||
          answers.assistancePrograms.includes("Medicare")
        ) {
          setCurrentStep("results-grocery");
        } else {
          setCurrentStep("results-agent");
        }
      } else if (shouldShowGroceryPath()) {
        setCurrentStep("results-grocery");
      } else {
        setCurrentStep("results");
      }
    }, 1500);
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 z-10">
        <ProgressBar progress={progress} />
      </div>

      <Card className="border-t-4 border-t-primary shadow-lg mt-2 overflow-hidden">
        <CardContent className="p-0">
          {currentStep === "rebate-check" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>IRS Federal Subsidy Credit Verification Survey</span>
                  <span className="text-base text-muted-foreground font-normal">
                    Verify Your $3,000 Subsidy Status
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-2 sm:mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <span className="font-bold">URGENT:</span> The IRS
                      estimates 5.5 million {userState} still haven't claimed
                      their $3,000 Federal Subsidy Credits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium">
                  Have you already claimed your $3,000 Federal Subsidy Credits?
                </h3>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-base font-normal"
                    onClick={() => handleRebateAnswer("Yes")}
                  >
                    Yes, I've received it
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-base font-normal"
                    onClick={() => handleRebateAnswer("No")}
                  >
                    No, I haven't received anything
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-base font-normal"
                    onClick={() => handleRebateAnswer("Not sure")}
                  >
                    I'm not sure if I received it
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "grocery-card-offer" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Grocery Assistance</span>
                  <span className="text-base text-muted-foreground font-normal">
                    Additional Benefit Eligibility Check
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="bg-blue-50 border-l-4 border-primary p-3 sm:p-4 mb-2 sm:mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-foreground">
                      <span className="font-bold">NEW BENEFIT AVAILABLE:</span>{" "}
                      You may qualify for a Pre-Paid $500 Card for groceries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground">
                  Would you like to receive a Pre-Paid $500 Card for Groceries?
                </h3>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 text-base"
                    onClick={handleGroceryCardOffer}
                  >
                    Check Now for $500 Card
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === "checking-records" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Verification System</span>
                  <span className="text-base text-muted-foreground font-normal">
                    Checking Federal Records
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="flex flex-col items-center justify-center py-4 sm:py-6">
                <CheckingAnimation text="Checking federal payment records..." />

                {showTextBubble && (
                  <div className="mt-4 sm:mt-6 bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 w-full">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700 font-bold">
                          ALERT: Millions of Americans still qualify for
                          unclaimed $3,000 payments
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === "location" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Location Verification</span>
                  <span className="text-base text-muted-foreground font-normal">
                    $3,000 Federal Subsidy Program
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-2 sm:mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-bold">
                      TIME SENSITIVE: Funds expire on{" "}
                      {new Date(Date.now() + 86400000).toLocaleDateString()}.
                      Complete your audit to claim $3,000 payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium">
                  What's your ZIP code?
                </h3>

                <form
                  onSubmit={handleZipSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="space-y-2">
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={5}
                      value={answers.zipCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const state =
                          value.length === 5 ? getStateFromZip(value) : null;

                        setAnswers({
                          ...answers,
                          zipCode: value,
                          state: state || "",
                        });
                      }}
                      className="h-12 text-lg"
                      placeholder="Enter ZIP code"
                    />

                    {answers.state && (
                      <p className="text-sm text-gray-600">
                        Location: {answers.state}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    Your ZIP code helps determine local subsidy eligibility.
                  </p>

                  {answers.zipCode.length === 5 && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm text-green-700 font-medium">
                        ZIP code confirmed - you may qualify!
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={answers.zipCode.length !== 5}
                  >
                    Continue to Check Eligibility
                  </Button>
                </form>
              </div>
            </div>
          )}

          {currentStep === "assistance" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Program Check</span>
                  <span className="text-base text-muted-foreground font-normal">
                    $3,000 Federal Subsidy Program
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-2 sm:mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-bold">
                      Your location qualifies you for the $3,000 recovery
                      credit!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium">
                  Are you currently enrolled in any of these programs? (Select
                  all that apply)
                </h3>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("Medicaid") &&
                        "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("Medicaid")}
                  >
                    Medicaid
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("Medicare") &&
                        "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("Medicare")}
                  >
                    Medicare
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("SNAP") &&
                        "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("SNAP")}
                  >
                    SNAP (Food Stamps)
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes(
                        "None of the above"
                      ) && "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("None of the above")}
                  >
                    None of the above
                  </Button>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={handleAssistanceSubmit}
                >
                  Complete Eligibility Check Now
                </Button>
              </div>
            </div>
          )}

          {currentStep === "assistance-alt" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Grocery Assistance</span>
                  <span className="text-base text-muted-foreground font-normal">
                    Additional Program Verification
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-2 sm:mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      To qualify for the $500 Grocery Card, we need to verify
                      your eligibility.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium">
                  Are you currently enrolled in any of these programs? (Select
                  all that apply)
                </h3>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("Medicaid") &&
                        "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("Medicaid")}
                  >
                    Medicaid
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("Medicare") &&
                        "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("Medicare")}
                  >
                    Medicare
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("SNAP") &&
                        "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("SNAP")}
                  >
                    SNAP (Food Stamps)
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes(
                        "None of the above"
                      ) && "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("None of the above")}
                  >
                    None of the above
                  </Button>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={handleAssistanceSubmit}
                >
                  Check My Eligibility
                </Button>
              </div>
            </div>
          )}

          {currentStep === "checking-assistance" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Final Verification</span>
                  <span className="text-base text-muted-foreground font-normal">
                    Confirming Eligibility Status
                  </span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="flex flex-col items-center justify-center py-4 sm:py-8">
                <CheckingAnimation text="Finalizing eligibility assessment..." />
              </div>
            </div>
          )}

          {currentStep === "results" && (
            <div className="p-6 space-y-6">
              {/* Header with Approved Badge and Correspondent Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-green-600 text-white px-3 py-1 rounded font-bold text-sm">
                    APPROVED
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>IRS • Tax Credits</span>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div className="font-semibold text-foreground">Sarah Mitchell</div>
                  <div>Tax Policy Correspondent</div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Main Title */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Federal Subsidy Audit Report
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your eligibility has been confirmed
                </p>
              </div>

              {/* Centered Eligibility Box */}
              <div className="flex justify-center py-4">
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center max-w-sm">
                  <p className="text-green-700 font-medium mb-2">
                    You were found eligible for
                  </p>
                  <div className="text-5xl font-bold text-green-600 mb-1">
                    $ 2,007.32
                  </div>
                  <p className="text-green-700 text-sm">
                    Federal Subsidy Credit
                  </p>
                </div>
              </div>

              {/* Call to Action Text */}
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  You must call now to finalize.
                </p>
              </div>

              {/* Approved Items */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold text-foreground">APPROVED:</span>{" "}
                    <span className="text-foreground">$2000 Federal Subsidy Credit</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold text-foreground">APPROVED:</span>{" "}
                    <span className="text-foreground">Benefits Support Package</span>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <div>
                <a
                  href="tel:18663988047"
                  className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors"
                >
                  Connect to Agent Now
                </a>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground text-center">
                You'll speak with a certified Benefits Agent to confirm your identity and receive your benefits support package and $2000 Credits.
              </p>

              {/* Case ID and Countdown */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-sm">
                    <span className="font-bold text-foreground">Case ID:</span>{" "}
                    <span className="font-mono text-foreground">{caseId}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-600 font-bold">
                    Agent Available Now:
                  </div>
                </div>
                <CountdownTimer expiryDate={expiryDate} />
              </div>

              {/* Card Image */}
              <div className="flex justify-center pt-4">
                <img 
                  src="/recovery-card.jpg" 
                  alt="Recovery Act Credit Card" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {currentStep === "results-grocery" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  FedBenefit Eligibility Report
                </h2>
                <FileCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-green-50 border-2 border-green-500 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg sm:text-xl font-bold text-green-800">
                      DOUBLE BENEFIT APPROVED!
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-green-800 font-medium">
                    You qualify for BOTH the $3,000 Federal Subsidy Credits AND
                    a $500 Grocery Card!
                  </p>
                </div>

                <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Case ID:</span>
                    <span className="text-sm font-mono font-semibold">
                      {caseId}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-sm text-gray-600">
                      Assistance Programs:
                    </span>
                    <span className="text-sm font-semibold">
                      {answers.assistancePrograms.join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-semibold text-green-600">
                      DUAL APPROVED
                    </span>
                  </div>

                  <div className="py-2 bg-blue-50 -mx-4 px-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Federal Subsidy Credits:</span>
                      <span className="text-lg font-bold text-green-600">
                        $3,000
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Grocery Assistance:</span>
                      <span className="text-lg font-bold text-green-600">
                        $500
                      </span>
                    </div>
                    <div className="flex justify-between border-t-2 border-green-600 pt-1 mt-1">
                      <span className="text-sm font-bold">Total Value:</span>
                      <span className="text-xl font-bold text-green-600">
                        $3,500
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-bold">
                        URGENT: Limited spots available. Claim before{" "}
                        <CountdownTimer expiryDate={expiryDate} />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-center">
                  <MoneyAnimation />
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                    Claim Your $3,500 in Benefits
                  </h3>
                  <p className="text-white text-sm mb-4">
                    Call now to secure BOTH your Federal Subsidy Credits and
                    Grocery Card
                  </p>

                  <a
                    href="tel:18663988047"
                    className="inline-block w-full bg-white text-green-600 font-bold py-4 px-6 rounded-lg text-lg hover:bg-gray-100 transition-colors"
                  >
                    📞 Call Now: 1-866-398-8047
                  </a>

                  <p className="text-white text-xs mt-3">
                    Priority Processing • FREE Consultation
                  </p>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Reference your Case ID ({caseId}) when calling to claim all
                    eligible benefits.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "results-agent" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  FedBenefit Eligibility Report
                </h2>
                <FileCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-yellow-50 border-2 border-yellow-500 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
                    <h3 className="text-lg sm:text-xl font-bold text-yellow-800">
                      ADDITIONAL VERIFICATION NEEDED
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-yellow-800 font-medium">
                    To process your $500 Grocery Card application, please speak
                    with a specialist.
                  </p>
                </div>

                <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Case ID:</span>
                    <span className="text-sm font-mono font-semibold">
                      {caseId}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      PENDING VERIFICATION
                    </span>
                  </div>

                  <div className="flex justify-between py-2 bg-blue-50 -mx-4 px-4 rounded">
                    <span className="text-sm font-medium">
                      Potential Benefit:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      $500
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShoppingCart className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Our specialists can help verify your eligibility for
                        additional grocery assistance programs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-center">
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                    Complete Your Application
                  </h3>
                  <p className="text-white text-sm mb-4">
                    Speak with a specialist to verify eligibility
                  </p>

                  <a
                    href="tel:18663988047"
                    className="inline-block w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-lg text-lg hover:bg-gray-100 transition-colors"
                  >
                    📞 Call Now: 1-866-398-8047
                  </a>

                  <p className="text-white text-xs mt-3">
                    FREE Verification • No Obligation
                  </p>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    Reference your Case ID ({caseId}) when calling for faster
                    service.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

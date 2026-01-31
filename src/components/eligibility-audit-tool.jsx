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

  const [isInitializing, setIsInitializing] = useState(true);
  const [currentStep, setCurrentStep] = useState("rebate-check");
  const [userState, setUserState] = useState("Americans"); // Default to Americans
  const [answers, setAnswers] = useState({
    rebateClaimed: "",
    zipCode: "",
    state: "",
    assistancePrograms: ["None of the above"],
    flowPath: "standard", // "standard", "grocery"
  });
  const [progress, setProgress] = useState(0);
  const [showTextBubble, setShowTextBubble] = useState(false);
  const [caseId] = useState(
    `RR-${Math.floor(1000 + Math.random() * 9000)}-HHS`
  );

  // Convert state name to demonym (e.g., "California" -> "Californians")
  const getStateDemonym = (stateName) => {
    const demonyms = {
      "Alabama": "Alabamians",
      "Alaska": "Alaskans",
      "Arizona": "Arizonans",
      "Arkansas": "Arkansans",
      "California": "Californians",
      "Colorado": "Coloradans",
      "Connecticut": "Connecticuters",
      "Delaware": "Delawareans",
      "Florida": "Floridians",
      "Georgia": "Georgians",
      "Hawaii": "Hawaiians",
      "Idaho": "Idahoans",
      "Illinois": "Illinoisans",
      "Indiana": "Hoosiers",
      "Iowa": "Iowans",
      "Kansas": "Kansans",
      "Kentucky": "Kentuckians",
      "Louisiana": "Louisianans",
      "Maine": "Mainers",
      "Maryland": "Marylanders",
      "Massachusetts": "Massachusetts residents",
      "Michigan": "Michiganders",
      "Minnesota": "Minnesotans",
      "Mississippi": "Mississippians",
      "Missouri": "Missourians",
      "Montana": "Montanans",
      "Nebraska": "Nebraskans",
      "Nevada": "Nevadans",
      "New Hampshire": "New Hampshirites",
      "New Jersey": "New Jerseyans",
      "New Mexico": "New Mexicans",
      "New York": "New Yorkers",
      "North Carolina": "North Carolinians",
      "North Dakota": "North Dakotans",
      "Ohio": "Ohioans",
      "Oklahoma": "Oklahomans",
      "Oregon": "Oregonians",
      "Pennsylvania": "Pennsylvanians",
      "Rhode Island": "Rhode Islanders",
      "South Carolina": "South Carolinians",
      "South Dakota": "South Dakotans",
      "Tennessee": "Tennesseans",
      "Texas": "Texans",
      "Utah": "Utahns",
      "Vermont": "Vermonters",
      "Virginia": "Virginians",
      "Washington": "Washingtonians",
      "West Virginia": "West Virginians",
      "Wisconsin": "Wisconsinites",
      "Wyoming": "Wyomingites",
      "D.C.": "D.C. residents",
      "District of Columbia": "D.C. residents"
    };
    return demonyms[stateName] || "Americans";
  };

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
  const [expiryDate] = useState(() => {
    const date = new Date();
    // Set expiry to 5 minutes from now instead of 3 days
    date.setMinutes(date.getMinutes() + 5);
    return date;
  });

  // Determine which results page to show based on user selections
  const shouldShowGroceryPath = () => {
    return (
      answers.assistancePrograms.includes("Medicaid") ||
      answers.assistancePrograms.includes("Medicare")
    );
  };

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

  // Show initializing state briefly
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
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
      // If "None of the above" is selected, clear all other selections
      if (updatedPrograms.includes(program)) {
        // If it's already selected and clicked again, do nothing
        return;
      } else {
        // If it's not selected, clear all other selections and select only this
        setAnswers({ ...answers, assistancePrograms: ["None of the above"] });
        return;
      }
    } else {
      // If any other option is selected, remove "None of the above"
      const withoutNone = updatedPrograms.filter(
        (p) => p !== "None of the above"
      );

      if (withoutNone.includes(program)) {
        // If already selected, remove it
        const index = withoutNone.indexOf(program);
        withoutNone.splice(index, 1);

        // If no programs left, add "None of the above" back
        if (withoutNone.length === 0) {
          setAnswers({ ...answers, assistancePrograms: ["None of the above"] });
          return;
        }
      } else {
        // If not selected, add it
        withoutNone.push(program);
      }

      setAnswers({ ...answers, assistancePrograms: withoutNone });
    }
  };

  // Handle assistance submission
  const handleAssistanceSubmit = () => {
    setCurrentStep("checking-assistance");

    // Simulate checking and move to results
    setTimeout(() => {
      // Determine which results page to show
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
          {isInitializing ? (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>IRS Federal Subsidy Credit Verification Survey</span>
                  <span className="text-base text-muted-foreground font-normal">Verify Your $3,000 Subsidy Status</span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="text-base sm:text-lg font-semibold text-foreground">Initializing secure session</p>
                  <p className="text-sm text-muted-foreground">Please wait while we verify your eligibility</p>
                </div>
              </div>
            </div>
          )}

          {!isInitializing && currentStep === "rebate-check" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>IRS Federal Subsidy Credit Verification Survey</span>
                  <span className="text-base text-muted-foreground font-normal">Verify Your $3,000 Subsidy Status</span>
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
                  <span className="text-base text-muted-foreground font-normal">Additional Benefit Eligibility Check</span>
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
                  <span className="text-base text-muted-foreground font-normal">Checking Federal Records</span>
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
                  <span className="text-base text-muted-foreground font-normal">$3,000 Federal Subsidy Program</span>
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
                      <span className="text-sm font-bold text-green-700">
                        REGION ELIGIBLE: FUNDS AVAILABLE
                      </span>
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
                  <span className="text-base text-muted-foreground font-normal">$3,000 Federal Subsidy Program</span>
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
                  Are you currently enrolled in any of these programs?
                </h3>
                <p className="text-sm text-gray-500">Select all that apply</p>

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
                      answers.assistancePrograms.includes("SNAP / EBT") &&
                      "border-primary bg-blue-50 text-foreground"
                    )}
                    onClick={() => handleAssistanceSelect("SNAP / EBT")}
                  >
                    SNAP / EBT
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

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-2 sm:mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <span className="font-bold">FINAL STEP:</span> Complete
                        your eligibility check to see if you can claim your
                        $3,000 payment. your eligibility check to see if you can
                        claim your $3,000 payment.
                      </p>
                    </div>
                  </div>
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
                  <span className="text-base text-muted-foreground font-normal">Additional Program Verification</span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-2 sm:mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-bold">
                      You may qualify for a $500 grocery card benefit!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium">
                  Are you currently enrolled in any of these programs?
                </h3>
                <p className="text-sm text-gray-500">Select all that apply</p>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("Medicaid") &&
                      "border-blue-600 bg-blue-50"
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
                      "border-blue-600 bg-blue-50"
                    )}
                    onClick={() => handleAssistanceSelect("Medicare")}
                  >
                    Medicare
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes("SNAP / EBT") &&
                      "border-blue-600 bg-blue-50"
                    )}
                    onClick={() => handleAssistanceSelect("SNAP / EBT")}
                  >
                    SNAP / EBT
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-base font-normal",
                      answers.assistancePrograms.includes(
                        "None of the above"
                      ) && "border-blue-600 bg-blue-50"
                    )}
                    onClick={() => handleAssistanceSelect("None of the above")}
                  >
                    None of the above
                  </Button>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-2 sm:mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <span className="font-bold">FINAL STEP:</span> Complete
                        your eligibility check to see if you can claim your $500
                        grocery card.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
                  onClick={handleAssistanceSubmit}
                >
                  Complete Eligibility Check Now
                </Button>
              </div>
            </div>
          )}

          {currentStep === "checking-assistance" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex flex-col text-foreground">
                  <span>FedBenefit Final Verification</span>
                  <span className="text-base text-muted-foreground font-normal">Confirming Eligibility Status</span>
                </h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="flex flex-col items-center justify-center py-4 sm:py-8">
                <CheckingAnimation text="Finalizing your eligibility status..." />
              </div>
            </div>
          )}

          {currentStep === "results" && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  FedBenefit Eligibility Report
                </h2>
                <FileCheck className="h-6 w-6 text-primary" />
              </div>

              <div className="flex flex-col items-center justify-center py-3 sm:py-4">
                <MoneyAnimation />
                <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-green-600 flex items-center">
                  You must call now to finalize.
                </h3>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-sm sm:text-base">
                    <span className="font-bold">APPROVED:</span> $3,000 Federal Subsidy Credits
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <p className="text-sm sm:text-base">
                    <span className="font-bold">APPROVED:</span> Benefits
                    Support Package
                  </p>
                </div>
              </div>

              <a
                href="tel:+1-888-777-6666"
                className="w-full bg-green-600 hover:bg-green-700 h-12 sm:h-14 text-sm sm:text-base text-white flex items-center justify-center rounded-md font-medium"
              >
                Connect to Agent Now
              </a>

              <p className="text-xs sm:text-sm text-center mt-2 sm:mt-3 mb-3 sm:mb-4">
                You'll speak with a certified Benefits Agent to confirm your
                identity and receive your benefits support package and $1400 Health Subsidy.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 space-y-1.5 max-w-[95%] mx-auto text-sm">
                <p className="text-xs sm:text-sm">
                  <span className="font-bold">Case ID:</span> {caseId}
                </p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <p className="text-xs sm:text-sm text-red-600 font-bold">
                    Agent Available Now:
                  </p>
                </div>
                <CountdownTimer
                  expiryDate={expiryDate}
                  isActive={currentStep === "results"}
                />
              </div>

              <div className="mt-4 overflow-hidden max-w-[95%] mx-auto">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%20-%202025-04-15T124406.384-3248aFWOiGZlS4MA8e7Ig278mb5zWs.png"
                  alt="Recovery Credit Card showing $1,407.32 balance"
                  className="w-full h-auto"
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

              <div className="flex flex-col items-center justify-center py-3 sm:py-4">
                <div className="relative w-64 h-40 flex items-center justify-center">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow-lg" />

                  {/* Border effect */}
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-xl opacity-70" />

                  {/* Grocery card and amount */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-blue-700 font-semibold text-lg mb-2 text-center">
                      You were found eligible for
                    </div>

                    <div className="flex items-center text-blue-600 animate-pulse">
                      <ShoppingCart
                        className="h-14 w-14 drop-shadow-md"
                        strokeWidth={2.5}
                      />
                      <div className="flex flex-col ml-1">
                        <span className="text-4xl font-bold tracking-tight drop-shadow-md">
                          $500
                        </span>
                        <span className="text-sm text-blue-700 font-medium">
                          Monthly Grocery Card
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-blue-600 flex items-center">
                  You must call now to finalize.
                </h3>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm sm:text-base">
                    <span className="font-bold">APPROVED:</span> $500/month
                    Grocery Benefit Card
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm sm:text-base">
                    <span className="font-bold">APPROVED:</span> Nutrition
                    Assistance Program
                  </p>
                </div>
              </div>

              <a
                href="https://www.rpjh8fm.com/T58MD/52TFBR/?sub1=pathbmedi1400"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 sm:h-14 text-sm sm:text-base text-white flex items-center justify-center rounded-md font-medium"
              >
                Finalize Medicare Allowance Here
              </a>

              <p className="text-xs sm:text-sm text-center mt-2 sm:mt-3 mb-3 sm:mb-4">
                You'll speak with a certified Benefits Agent to confirm your
                identity and receive your $500 monthly grocery card.
              </p>

              <div className="max-w-[95%] mx-auto mt-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Mar%2027%2C%202025%2C%2008_42_04%20PM-7qpurFvb7VzuR2sdZGWnbP3ABH95ht.png"
                  alt="Medicare Wellness Card - $2,600 Prepaid"
                  className="w-full"
                />
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

              <div className="flex flex-col items-center justify-center py-3 sm:py-4">
                <div className="relative w-64 h-40 flex items-center justify-center">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow-lg" />

                  {/* Border effect */}
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-xl opacity-70" />

                  {/* Grocery card and amount */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-blue-700 font-semibold text-lg mb-2 text-center">
                      You were found eligible for
                    </div>

                    <div className="flex items-center text-blue-600 animate-pulse">
                      <ShoppingCart
                        className="h-14 w-14 drop-shadow-md"
                        strokeWidth={2.5}
                      />
                      <div className="flex flex-col ml-1">
                        <span className="text-4xl font-bold tracking-tight drop-shadow-md">
                          $500
                        </span>
                        <span className="text-sm text-blue-700 font-medium">
                          Monthly Grocery Card
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-blue-600 flex items-center">
                  You must call now to finalize.
                </h3>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm sm:text-base">
                    <span className="font-bold">APPROVED:</span> $500/month
                    Grocery Benefit Card
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm sm:text-base">
                    <span className="font-bold">APPROVED:</span> Nutrition
                    Assistance Program
                  </p>
                </div>
              </div>

              <a
                href="tel:+1-888-777-6666"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 sm:h-14 text-sm sm:text-base text-white flex items-center justify-center rounded-md font-medium"
              >
                Connect With Agent
              </a>

              <p className="text-xs sm:text-sm text-center mt-2 sm:mt-3 mb-3 sm:mb-4">
                You'll speak with a certified Benefits Agent to confirm your
                identity and receive your $500 monthly grocery card.
              </p>

              <div className="max-w-[95%] mx-auto mt-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Mar%2027%2C%202025%2C%2008_42_04%20PM-7qpurFvb7VzuR2sdZGWnbP3ABH95ht.png"
                  alt="Medicare Wellness Card - $2,600 Prepaid"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

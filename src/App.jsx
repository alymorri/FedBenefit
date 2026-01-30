import { EligibilityAuditTool } from "./components/eligibility-audit-tool";

function App() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-background pt-6 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">FB</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">FedBenefit</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Official Federal Benefits Verification Portal
            </p>
          </div>
          <EligibilityAuditTool />
        </div>
      </main>
    </>
  );
}

export default App;

import { EligibilityAuditTool } from "./components/eligibility-audit-tool";

function App() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-gray-50 pt-2">
        <div className="w-full max-w-md mx-auto">
          <EligibilityAuditTool />
        </div>
      </main>
    </>
  );
}

export default App;

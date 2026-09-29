interface ImportStepperProps {
  currentStep: number;
}

const steps = [
  {
    number: 1,
    title: "Upload CSV",
  },
  {
    number: 2,
    title: "Review & Validate",
  },
  {
    number: 3,
    title: "Import",
  },
];

export function ImportStepper({
  currentStep,
}: ImportStepperProps) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((step, index) => {
        const active = currentStep === step.number;
        const completed = currentStep > step.number;

        return (
          <div
            key={step.number}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex items-center gap-2">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition",
                  active || completed
                    ? "bg-[#40332a] text-white"
                    : "bg-gray-100 text-gray-500",
                ].join(" ")}
              >
                {step.number}
              </div>

              <span
                className={[
                  "hidden text-sm font-medium sm:block",
                  active || completed
                    ? "text-gray-900"
                    : "text-gray-400",
                ].join(" ")}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={[
                  "mx-4 h-px flex-1",
                  completed
                    ? "bg-[#40332a]"
                    : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};

export function applyApiErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown
) {
  const apiError = error as ApiError;

  if (apiError.errors) {
    Object.entries(apiError.errors).forEach(([field, messages]) => {
      form.setError(field as Path<T>, {
        type: "server",
        message: messages[0],
      });
    });

    return;
  }

  form.setError("root", {
    type: "server",
    message: apiError.message ?? "Something went wrong.",
  });
}
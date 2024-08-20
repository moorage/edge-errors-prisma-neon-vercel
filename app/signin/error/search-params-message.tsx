import { useSearchParams } from "next/navigation";

enum Error {
  Configuration = "Configuration",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There was a problem when trying to authenticate. Please contact us if this
      error persists. Unique error code:{" "}
      <code className="text-xs bg-slate-100 p-1 rounded-sm">Configuration</code>
    </p>
  ),
};

export function SearchParamsMessage() {
  const search = useSearchParams();
  const error = search.get("error") as Error;
  return <>{errorMap[error] || "Please contact us if this error persists."}</>;
}

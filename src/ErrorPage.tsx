import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  function goHome() {
    navigate("/");
  }

  return (
    <div id="error-page" className="flex h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-semibold">Uxxx!</h1>
        <p className="mb-5 mt-5 text-2xl font-semibold">Shu yerda nimadir xato ketdi.</p>
        <p className="text-xl font-semibold">
          <i>{errorMessage}</i>
        </p>
        <Button variant="secondary" onClick={goHome} className="mt-5 rounded px-10 py-2 font-bold">
          Bosh sahifaga qaytish
        </Button>
      </div>
    </div>
  );
}

import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/(auth)/services/authenticate";
import LoadingSpinner from "./ui/loading-spinner";
import { useActionState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  type: "button" | "submit" | "reset";
  children?: React.ReactNode;
  className?: string;
  label: string;
  loading?: boolean;
}

function Button({
  onClick,
  type,
  children,
  className,
  label,
  loading,
}: ButtonProps) {
  const content = loading ? <LoadingSpinner /> : children || label;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex justify-center items-center w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:pointer-events-none hover:underline underline-offset-4 ${className}`}
      disabled={loading}
      aria-label={label}
    >
      <span className="min-w-60 text-center">{content}</span>
    </button>
  );
}

function SingleSingOnButton() {
  const { pending } = useFormStatus();
  return (
    <section className="flex flex-col items-center">
      <Button
        type="submit"
        color="primary"
        loading={pending}
        label="Continue with GLF Account"
      />
    </section>
  );
}

export default function LoginForm() {
  const [errorMessage, signIn] = useActionState(authenticate, undefined);

  return (
    <form action={signIn}>
      <SingleSingOnButton />
      {errorMessage && (
        <p role="alert" className="text-red-500 pt-6">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

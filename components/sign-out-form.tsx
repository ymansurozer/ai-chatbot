import Form from 'next/form';
import { deauthenticate } from "@/app/(auth)/services/authenticate";

export default async function SignOutForm() {
  return (
    <Form
      className="w-full"
      action={async () => {
        "use server";
        await deauthenticate();
      }}
    >
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </Form>
  );
}
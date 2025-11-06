import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { login } from "../../service/login";

export default function SignInStaff() {
  return (
    <>
      <PageMeta title="Staff Login Dashboard" description="Staff login page" />
      <AuthLayout>
        <SignInForm loginApi={login} heading="Staff Login" />
      </AuthLayout>
    </>
  );
}

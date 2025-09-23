import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { resellerLogin } from "../../service/login"

export default function SignInReseller() {
  return (
    <>
      <PageMeta title="Reseller Login Dashboard" description="Reseller login page" />
      <AuthLayout>
        <SignInForm loginApi={resellerLogin} heading="Reseller Login" />
      </AuthLayout>
    </>
  );
}

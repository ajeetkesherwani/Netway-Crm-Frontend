import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
// import { login } from "../../service/login";
import { useLogin } from "../../service/login";

export default function SignInLco() {
  const { login } = useLogin();
  return (
    <>
      <PageMeta title="LCO Login Dashboard" description="LCO login page" />
      <AuthLayout>
        <SignInForm loginApi={login} heading="LCO Login" />
      </AuthLayout>
    </>
  );
}

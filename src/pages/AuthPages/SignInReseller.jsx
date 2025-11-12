import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
// import { login } from "../../service/login"
import { useLogin } from "../../service/login";

export default function SignInReseller() {
  const { login } = useLogin();
  return (
    <>
      <PageMeta
        title="Reseller Login Dashboard"
        description="Reseller login page"
      />
      <AuthLayout>
        <SignInForm loginApi={login} heading="Reseller Login" />
      </AuthLayout>
    </>
  );
}

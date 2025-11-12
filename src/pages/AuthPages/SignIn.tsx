// import PageMeta from "../../components/common/PageMeta";
// import AuthLayout from "./AuthPageLayout";
// import SignInForm from "../../components/auth/SignInForm";

// export default function SignIn() {
//   return (
//     <>
//       <PageMeta
//         title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
//         description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <AuthLayout>
//         <SignInForm />
//       </AuthLayout>
//     </>
//   );
// }

// import PageMeta from "../../components/common/PageMeta";
// import AuthLayout from "./AuthPageLayout";
// import SignInForm from "../../components/auth/SignInForm";
// import { useLogin } from "../../service/login";

// export default function SignIn() {
//   return (
//     <>
//       <PageMeta title="Admin Login Dashboard" description="Admin login page" />
//       <AuthLayout>
//         <SignInForm loginApi={useLogin} heading="Admin Login" />
//       </AuthLayout>
//     </>
//   );
// }

import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useLogin } from "../../service/login";

export default function SignIn() {
  const { login } = useLogin(); // ✅ Call hook here

  return (
    <>
      <PageMeta title="Admin Login Dashboard" description="Admin login page" />
      <AuthLayout>
        {/* ✅ Pass login function, not hook */}
        <SignInForm loginApi={login} heading="Admin Login" />
      </AuthLayout>
    </>
  );
}

// // import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import "swiper/swiper-bundle.css";
// import "flatpickr/dist/flatpickr.css";
// import App from "./App.tsx";
// import { AppWrapper } from "./components/common/PageMeta.tsx";
// import { ThemeProvider } from "./context/ThemeContext.tsx";
// import { PermissionProvider } from "./context/PermissionContext.jsx";

// // createRoot(document.getElementById("root")!).render(
// //  // <StrictMode>
// //     <ThemeProvider>
// //       <AppWrapper>
// //         <App />
// //       </AppWrapper>
// //     </ThemeProvider>
// //  // </StrictMode>,
// // );

// createRoot(document.getElementById("root")!).render(
//   <ThemeProvider>
//     <PermissionProvider>
//       <AppWrapper>
//         <App />
//       </AppWrapper>
//     </PermissionProvider>
//   </ThemeProvider>
// );

import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { SidebarProvider } from "./context/SidebarContext.tsx"; // ✅ make sure you import this
import { PermissionProvider } from "./context/PermissionContext.jsx"; // ✅ your context

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <PermissionProvider>
      <SidebarProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </SidebarProvider>
    </PermissionProvider>
  </ThemeProvider>
);

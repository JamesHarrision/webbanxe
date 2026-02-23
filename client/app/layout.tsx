import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../lib/antd-registry";
import { ConfigProvider, App } from "antd";
import theme from "../theme/themeConfig";
import QueryProvider from "@/components/providers/QueryProvider";
import { ModalProvider } from "@/context/ModalContext";
import LeadModal from "@/components/modals/LeadModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VINFAST TIỀN GIANG",
  description: "Đại lý ủy quyền VinFast tại Tiền Giang. Cung cấp các dòng xe điện thông minh, an toàn và bền vững.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        <StyledComponentsRegistry>
          <ConfigProvider theme={theme}>
            <App>
              <ModalProvider>
                <QueryProvider>
                  <Suspense fallback={null}>
                    {children}
                  </Suspense>
                  <LeadModal />
                </QueryProvider>
              </ModalProvider>
            </App>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

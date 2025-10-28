import * as React from "react";
import { AuthProvider, useAuth } from "./auth-context";
import { DataProvider, useData } from "./data-context";
import { AppStateProvider, useAppState } from "./app-state-context";

export { useAuth, useData, useAppState };

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [authHydrated, setAuthHydrated] = React.useState(false);
  const [dataHydrated, setDataHydrated] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for both providers to finish loading, then mark as hydrated
  React.useEffect(() => {
    if (authHydrated && dataHydrated) {
      setIsHydrated(true);
    }
  }, [authHydrated, dataHydrated]);

  return (
    <AppStateProvider isHydrated={isHydrated}>
      <AuthProvider onHydrated={() => setAuthHydrated(true)}>
        <DataProvider onHydrated={() => setDataHydrated(true)}>
          {children}
        </DataProvider>
      </AuthProvider>
    </AppStateProvider>
  );
}

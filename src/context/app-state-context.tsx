import * as React from "react";

// Explicit type definitions to avoid complex inference
export interface AppState {
  isHydrated: boolean;
}

// Explicit type for the context value
type AppStateContextValue = AppState;

const AppStateContext = React.createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children, isHydrated }: { children: React.ReactNode; isHydrated: boolean }) {
  // Explicitly typed context value to prevent type inference issues
  const value: AppStateContextValue = {
    isHydrated,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}

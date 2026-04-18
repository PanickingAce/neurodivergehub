import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Account {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
  preferences: {
    notifications: boolean;
    shareData: boolean;
  };
}

interface AccountContextType {
  account: Account | null;
  isLoggedIn: boolean;
  createAccount: (data: { username: string; email: string; displayName: string; password: string }) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateAccount: (data: Partial<Account>) => void;
  deleteAccount: () => void;
}

const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(() => {
    try {
      const stored = localStorage.getItem("nd_hub_account");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (account) {
      localStorage.setItem("nd_hub_account", JSON.stringify(account));
    } else {
      localStorage.removeItem("nd_hub_account");
    }
  }, [account]);

  const createAccount = (data: { username: string; email: string; displayName: string; password: string }) => {
    const existing = localStorage.getItem("nd_hub_accounts");
    const accounts: Record<string, { passwordHash: string; account: Account }> = existing ? JSON.parse(existing) : {};

    if (Object.values(accounts).some(a => a.account.email === data.email)) {
      return { success: false, error: "An account with this email already exists." };
    }
    if (Object.values(accounts).some(a => a.account.username === data.username)) {
      return { success: false, error: "This username is already taken." };
    }

    const newAccount: Account = {
      id: crypto.randomUUID(),
      username: data.username,
      email: data.email,
      displayName: data.displayName,
      createdAt: new Date().toISOString(),
      preferences: { notifications: true, shareData: false },
    };

    accounts[data.email] = { passwordHash: btoa(data.password), account: newAccount };
    localStorage.setItem("nd_hub_accounts", JSON.stringify(accounts));
    setAccount(newAccount);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const existing = localStorage.getItem("nd_hub_accounts");
    if (!existing) return { success: false, error: "No account found with this email." };
    const accounts: Record<string, { passwordHash: string; account: Account }> = JSON.parse(existing);
    const entry = accounts[email];
    if (!entry) return { success: false, error: "No account found with this email." };
    if (entry.passwordHash !== btoa(password)) return { success: false, error: "Incorrect password." };
    setAccount(entry.account);
    return { success: true };
  };

  const logout = () => setAccount(null);

  const updateAccount = (data: Partial<Account>) => {
    if (!account) return;
    const updated = { ...account, ...data };
    setAccount(updated);
    const existing = localStorage.getItem("nd_hub_accounts");
    if (existing) {
      const accounts: Record<string, { passwordHash: string; account: Account }> = JSON.parse(existing);
      if (accounts[account.email]) {
        accounts[account.email].account = updated;
        localStorage.setItem("nd_hub_accounts", JSON.stringify(accounts));
      }
    }
  };

  const deleteAccount = () => {
    if (!account) return;
    const existing = localStorage.getItem("nd_hub_accounts");
    if (existing) {
      const accounts: Record<string, { passwordHash: string; account: Account }> = JSON.parse(existing);
      delete accounts[account.email];
      localStorage.setItem("nd_hub_accounts", JSON.stringify(accounts));
    }
    setAccount(null);
  };

  return (
    <AccountContext.Provider value={{ account, isLoggedIn: !!account, createAccount, login, logout, updateAccount, deleteAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}

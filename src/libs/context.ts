import { useContext, createContext, Dispatch, SetStateAction } from "react";

type Props = {
  children: React.ReactNode;
};

type Context = {
  isAuthenticated: boolean,
  userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
};

const initialContext: Context = {
  isAuthenticated: false,
  userHasAuthenticated: (): void => { },
};

export const AppContext = createContext<Context>(initialContext);

export function useAppContext() {
  return useContext(AppContext);
}
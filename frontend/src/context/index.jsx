import { jwtDecode } from "jwt-decode";
import React, { createContext, useState } from "react";
import Cookies from "universal-cookie";

export const UserContext = createContext();
export const TokenAuth = createContext();
export const DialogContext = createContext();
export const LoginDialogContext = createContext();
export const UpdateMovieContext = createContext();
export const RemoveMovieContext = createContext();
export const ReplaceMovieContext = createContext();

export default function ContextProvider({ children }) {
  const cookies = new Cookies();
  const [userData, setUserData] = useState(
    cookies.get("token") ? jwtDecode(cookies.get("token")) : null
  );

  const [checkTokenAuth, setTokenAuth] = useState(
    cookies.get("token") ? cookies.get("token") : null
  );

  const [newMovieDialog, setNewMovieDialog] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const [updateMovieDialog, setUpdateMovieDialog] = useState(false);
  const [removeMovieDialog, setRemoveMovieDialog] = useState(false);
  const [replaceMovieDialog, setReplaceMovieDialog] = useState(false);

  const logout = () => {
    cookies.remove("token", { path: "/" });
    setTokenAuth(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <TokenAuth.Provider value={{ checkTokenAuth, setTokenAuth, logout }}>
        <ReplaceMovieContext.Provider
          value={{ replaceMovieDialog, setReplaceMovieDialog }}
        >
          <UpdateMovieContext.Provider
            value={{ updateMovieDialog, setUpdateMovieDialog }}
          >
            <RemoveMovieContext.Provider
              value={{ removeMovieDialog, setRemoveMovieDialog }}
            >
              <DialogContext.Provider
                value={{ newMovieDialog, setNewMovieDialog }}
              >
                <LoginDialogContext.Provider
                  value={{ loginDialog, setLoginDialog }}
                >
                  {children}
                </LoginDialogContext.Provider>
              </DialogContext.Provider>
            </RemoveMovieContext.Provider>
          </UpdateMovieContext.Provider>
        </ReplaceMovieContext.Provider>
      </TokenAuth.Provider>
    </UserContext.Provider>
  );
}

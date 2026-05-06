import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { IconShield } from "../components/icons";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [agency, setAgency] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password, agency);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 px-4 relative overflow-hidden">
      {/* Soft animated background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 dark:opacity-80 animate-gradient-pan"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(60% 60% at 70% 70%, rgba(236,72,153,0.13) 0%, transparent 60%)",
        }}
      />
      <div className="w-full max-w-sm animate-fade-up">
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-500 grid place-items-center text-white animate-float-soft shadow-lg dark:shadow-indigo-500/30">
            <IconShield size={20} stroke={2.25} />
          </div>
          <div className="leading-tight">
            <div className="text-[16px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Veracity</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">Influencer Authenticity</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-black/20 animate-scale-in">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 mb-5 text-[12px] font-medium">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={
                "flex-1 py-1.5 rounded-md transition-colors " +
                (mode === "login"
                  ? "bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100"
                  : "text-slate-500 dark:text-slate-400")
              }
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={
                "flex-1 py-1.5 rounded-md transition-colors " +
                (mode === "signup"
                  ? "bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100"
                  : "text-slate-500 dark:text-slate-400")
              }
            >
              Sign up
            </button>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
              Email
              <input
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-[13px] bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
            <label className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
              Password
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-[13px] bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
            {mode === "signup" && (
              <label className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
                Agency name
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder="optional"
                  className="mt-1 w-full px-3 py-2 text-[13px] bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
            )}
            {error && (
              <div className="text-[12px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-md px-3 py-2">{error}</div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full bg-slate-900 dark:bg-indigo-500 text-white text-[13px] font-medium py-2 rounded-md hover:bg-slate-800 dark:hover:bg-indigo-400 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>
        <div className="text-center mt-4 text-[11px] text-slate-400 dark:text-slate-500">
          Demo: <span className="font-mono">admin</span> / <span className="font-mono">admin</span>
        </div>
      </div>
    </div>
  );
};

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

type Mode = "login" | "register" | "guest";

export default function LoginRegisterForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const { setUser } = useUser();
  const router = useRouter();

  const toggleMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "guest") {
        const { email } = formData;
        if (!email) throw new Error("El email es obligatorio");
        await authService.guestAccess(email);
      } else if (mode === "login") {
        const { email, password } = formData;
        if (!email || !password) throw new Error("Faltan campos obligatorios");
        await authService.login(email, password);
      } else {
        const { username, email, password, avatarUrl } = formData;
        if (!username || !email || !password) throw new Error("Faltan campos obligatorios");
        await authService.register(username, email, password, avatarUrl);
      }

      const me = await authService.me();
      setUser(me);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<Mode, string> = {
    login: "Iniciar sesión",
    register: "Crear cuenta",
    guest: "Acceder como invitado",
  };

  const inputClass =
    "w-full p-3 rounded-lg border border-slate-700 bg-[#050509] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#170fdb] focus:border-[#170fdb] transition";

  const formContainerClass =
    "w-full max-w-md md:max-w-2xl rounded-2xl border border-slate-800 bg-[#0B0B10] p-6 md:p-8 shadow-md shadow-black/40 transition-all";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0B10] px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`w-full max-w-md md:max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-[#0B0B10] p-6 md:p-8 shadow-md shadow-black/40 transition-all`}
      >
        <h2 className="text-3xl font-heading text-center mb-6 tracking-wide text-white">
          {titles[mode]}
        </h2>

        {error && (
          <div className="mb-4 text-red-500 font-semibold text-sm">{error}</div>
        )}

        <AnimatePresence mode="wait">
          {mode === "guest" && (
            <motion.form
              key="guest"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 w-full"
              onSubmit={handleSubmit}
            >
              <p className="text-sm text-slate-400">
                Solo necesitas tu email para leer los hilos. No podrás crear ni responder.
              </p>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-200">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="correo@example.com"
                  className={inputClass}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#170fdb] text-white shadow-md shadow-blue-600/40 hover:bg-white hover:text-[#170fdb] disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading ? "Cargando..." : "Entrar como invitado"}
              </Button>
            </motion.form>
          )}

          {mode === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 w-full"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-200">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="correo@example.com"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-200">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#170fdb] text-white shadow-md shadow-blue-600/40 hover:bg-white hover:text-[#170fdb] disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading ? "Cargando..." : "Entrar"}
              </Button>
            </motion.form>
          )}

          {mode === "register" && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 w-full max-w-full md:max-w-2xl"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-200">Nombre de usuario</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-200">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-200">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#170fdb] text-white shadow-md shadow-blue-600/40 hover:bg-white hover:text-[#170fdb] disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {loading ? "Cargando..." : "Registrarse"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-col gap-2">
          {mode !== "guest" && (
            <button
              type="button"
              onClick={() => toggleMode("guest")}
              className="w-full text-sm font-semibold text-slate-400 hover:text-[#FF3333] transition"
            >
              Solo quiero leer → Acceder como invitado
            </button>
          )}
          {mode !== "login" && (
            <button
              type="button"
              onClick={() => toggleMode("login")}
              className="w-full text-sm font-semibold text-slate-400 hover:text-[#FF3333] transition"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          )}
          {mode !== "register" && (
            <button
              type="button"
              onClick={() => toggleMode("register")}
              className="w-full text-sm font-semibold text-slate-400 hover:text-[#FF3333] transition"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
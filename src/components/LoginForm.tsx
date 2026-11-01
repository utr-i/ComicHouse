"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginValues) {
    setErrorApi(null);
    startTransition(async () => {
      const res = await loginAction(values);
      if (res?.error) setErrorApi(res.error);
    });
  }

  const campo =
    "w-full rounded-lg border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-ink";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm text-muted">
          Usuario
        </label>
        <input id="username" className={campo} {...register("username")} />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-muted">
          Contrasena
        </label>
        <input
          id="password"
          type="password"
          className={campo}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {errorApi && (
        <p className="rounded-lg bg-rose px-4 py-2 text-sm text-[#23212b]">
          {errorApi}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-lilac px-5 py-2 text-sm text-[#23212b] hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
import { useId, useState, type InputHTMLAttributes } from "react";
import { icons } from "../../../icons";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  showPasswordToggle?: boolean;
  error?: string;
}

export function Input({
  label,
  className = "",
  id,
  type,
  showPasswordToggle = false,
  error,
  ...props
}: InputProps) {
  const generatedId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = type === "password";
  const canTogglePassword = isPasswordField && showPasswordToggle;
  const inputType = canTogglePassword && isPasswordVisible ? "text" : type;
  const PasswordIcon = isPasswordVisible ? icons.eyeOff : icons.eyeOn;
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-body-sm font-semibold text-content-primary" htmlFor={inputId}>
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          {...props}
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : props["aria-describedby"]}
          className={[
            "min-h-12 w-full rounded-md bg-surface-raised px-3.5 py-3 text-body text-content-primary shadow-xs outline-none ring-1 ring-inset ring-border placeholder:text-content-muted",
            "transition-[background-color,box-shadow,color] duration-200 ease-out focus:ring-2 focus:ring-primary",
            "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-content-muted",
            error ? "ring-danger focus:ring-danger" : "",
            canTogglePassword ? "pr-12" : "",
            className,
          ].filter(Boolean).join(" ")}
        />

        {canTogglePassword && (
          <button
            type="button"
            className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm border-0 bg-transparent p-0 text-primary transition-[color,transform] duration-200 ease-out hover:text-primary-hover active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={isPasswordVisible}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
          >
            <PasswordIcon aria-hidden="true" />
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="m-0 text-caption font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

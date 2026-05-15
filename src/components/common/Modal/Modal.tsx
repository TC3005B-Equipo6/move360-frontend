import type { ReactNode } from "react";
import { Button } from "../Button/Button";
import { icons, type IconName } from "../../../icons";

export interface ModalProps {
  title?: string;
  message?: string;
  secondaryMessage?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCloseIcon?: boolean;
  confirmVariant?: "blue" | "red";
  iconName?: IconName;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const Modal = ({
  title,
  message,
  secondaryMessage,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  onClose,
  showCloseIcon = true,
  confirmVariant = "blue",
  iconName,
  children,
  footer,
  className = "",
}: ModalProps) => {
  const modalClasses = [
    "w-[440px] max-w-[calc(100vw-32px)] max-h-[95vh] overflow-hidden rounded-xl bg-surface-overlay p-6 font-sans shadow-xl ring-1 ring-inset ring-border-subtle",
    "flex flex-col",
    className,
  ].filter(Boolean).join(" ");
  const CloseIcon = icons.close;
  const Icon = iconName ? icons[iconName] : null;

  const hasCustomContent = Boolean(children);
  const hasDefaultFooter = Boolean(onConfirm || onCancel);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--backdrop)] p-4">
      <div className={modalClasses}>
        <div className="flex shrink-0 items-start justify-between gap-4">
          {title ? (
            <h3 className="m-0 text-wrap-balance text-h3 font-semibold text-content-primary">{title}</h3>
          ) : (
            <div />
          )}

          {showCloseIcon && (
            <button
              type="button"
              aria-label="Cerrar"
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-content-secondary transition-[background-color,color,transform] duration-200 ease-out hover:bg-surface-sunken hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
              onClick={onClose}
            >
              <CloseIcon size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          className={
            hasCustomContent
              ? "my-5 min-h-0 flex-1 overflow-y-auto pr-1"
              : "my-6 flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center"
          }
        >
          {hasCustomContent ? (
            children
          ) : (
            <>
              {Icon && (
                <div className="mb-1 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                  <Icon size={28} aria-hidden="true" />
                </div>
              )}

              {message && <p className="m-0 text-body-lg font-semibold text-content-primary">{message}</p>}

              {secondaryMessage && (
                <p className="m-0 text-body-sm font-medium text-content-secondary">{secondaryMessage}</p>
              )}
            </>
          )}
        </div>

        {footer ? (
          <div className="flex shrink-0 justify-end gap-3 border-t border-border-subtle pt-4">{footer}</div>
        ) : hasDefaultFooter ? (
          <div className="flex shrink-0 justify-center gap-3 border-t border-border-subtle pt-4">
            {onCancel && (
              <Button variant="white" size="medium" label={cancelText} onPress={onCancel} />
            )}

            {onConfirm && (
              <Button variant={confirmVariant} size="medium" label={confirmText} onPress={onConfirm} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

import type { ReactNode } from "react";
import styles from "./Modal.module.css";
import { Button } from "../Button/Button";

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
  icon?: ReactNode;

  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
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
  icon,
  children,
  footer,
  size = "md",
}: ModalProps) => {
  const modalClass = `${styles.modal} ${styles[size]}`;

  const hasCustomContent = Boolean(children);
  const hasDefaultFooter = Boolean(onConfirm || onCancel);

  return (
    <div className={styles.overlay}>
      <div className={modalClass}>
        <div className={styles.header}>
          {title ? <h3 className={styles.title}>{title}</h3> : <div />}

          {showCloseIcon && (
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
            >
              ×
            </button>
          )}
        </div>

        <div
          className={
            hasCustomContent ? styles.contentCustom : styles.contentCentered
          }
        >
          {hasCustomContent ? (
            children
          ) : (
            <>
              {icon && <div className={styles.icon}>{icon}</div>}

              {message && <p className={styles.message}>{message}</p>}

              {secondaryMessage && (
                <p className={styles.secondary}>{secondaryMessage}</p>
              )}
            </>
          )}
        </div>

        {footer ? (
          <div className={styles.footer}>{footer}</div>
        ) : hasDefaultFooter ? (
          <div className={styles.actions}>
            {onCancel && (
              <Button
                variant="white"
                size="medium"
                label={cancelText}
                onPress={onCancel}
              />
            )}

            {onConfirm && (
              <Button
                variant={confirmVariant}
                size="medium"
                label={confirmText}
                onPress={onConfirm}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
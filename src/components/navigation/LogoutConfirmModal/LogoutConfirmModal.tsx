import { Modal } from "../../common/Modal/Modal";

export interface LogoutConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

// Shared logout confirmation used by both the sidebar button and the profile
// menu, so the two entry points show the exact same dialog.
export const LogoutConfirmModal = ({ onClose, onConfirm }: LogoutConfirmModalProps) => (
  <Modal
    className="w-[430px] px-8 py-8"
    onClose={onClose}
    footer={
      <div className="flex w-full items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex min-h-12 w-[150px] cursor-pointer items-center justify-center rounded-md border-0 bg-surface-raised px-5 font-sans text-body font-semibold text-content-secondary shadow-xs ring-1 ring-inset ring-border transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:bg-surface-sunken hover:text-content-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="inline-flex min-h-12 w-[170px] cursor-pointer items-center justify-center rounded-md border-0 bg-danger px-5 font-sans text-body font-semibold text-content-on-primary shadow-sm transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-[#9f2f24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.96]"
          onClick={onConfirm}
        >
          Cerrar sesión
        </button>
      </div>
    }
  >
    <p className="m-0 text-center text-wrap-balance text-h3 font-semibold leading-tight text-content-primary">
      ¿Estás seguro de que deseas
      <br />
      cerrar sesión?
    </p>
  </Modal>
);

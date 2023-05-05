import { create } from "zustand";

interface RegisterModalProps {
    onOpen(): void,
    isOpen: boolean,
    onClose(): void
}

const useRegisterModal = create<RegisterModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useRegisterModal;
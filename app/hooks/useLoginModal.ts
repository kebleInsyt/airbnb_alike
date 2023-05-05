import { create } from "zustand";

interface LoginModalProps {
    onOpen(): void,
    isOpen: boolean,
    onClose(): void
}

const useLoginModal = create<LoginModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useLoginModal;
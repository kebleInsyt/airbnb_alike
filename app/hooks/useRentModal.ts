import { create } from "zustand";

interface RentModalProps {
    onOpen(): void,
    isOpen: boolean,
    onClose(): void
}

const useRentModal = create<RentModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useRentModal;
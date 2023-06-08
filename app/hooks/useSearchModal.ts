import { create } from "zustand";

interface SearchModalProps {
    onOpen(): void,
    isOpen: boolean,
    onClose(): void
}

const useSearchModal = create<SearchModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useSearchModal;
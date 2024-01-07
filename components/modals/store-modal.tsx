"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  return (
    <Modal
      title="Utwórz sklep"
      description={"Podaj nazwę sklepu, który chcesz utworzyć"}
      isOpen={isOpen}
      onClose={onClose}
    ></Modal>
  );
};

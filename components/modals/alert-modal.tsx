"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Czy jesteś pewny?"
      description="Nie będzie możliwości cofnięcia zmian!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-5 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

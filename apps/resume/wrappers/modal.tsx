import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  /**
   * If not provided, the Modal Header will not show.
   */
  headerText?: string;
  /** Ref that will immediately gain focus on open */
  initialFocusRef?: React.RefObject<HTMLElement>;
  onClose?: () => void;
  /** If not provided, the Modal Footer will not show. */
  onConfirm?: () => void;
}

const AddCreditsToPurchaseModal: React.FC<ModalProps> = ({
  children,
  headerText,
  isOpen,
  initialFocusRef,
  onClose,
  onConfirm,
}) => {
  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOnConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      initialFocusRef={initialFocusRef}
    >
      <ModalOverlay />
      <ModalContent>
        {headerText && <ModalHeader>{headerText}</ModalHeader>}
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {onConfirm && (
          <ModalFooter>
            <Button onClick={handleOnConfirm}>Confirm</Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddCreditsToPurchaseModal;

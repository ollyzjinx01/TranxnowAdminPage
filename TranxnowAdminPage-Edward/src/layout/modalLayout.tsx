import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type TModal = {
  children?: ReactNode;
  isOpen?: any;
  onClose?: any;
  size?: string;
};
const ModalLayout: FC<TModal> = ({ isOpen, onClose, children, size }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box py={"1.5em"}>{children}</Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalLayout;

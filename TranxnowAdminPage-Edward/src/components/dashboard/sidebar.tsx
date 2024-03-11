/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Box, Text, Flex, Center, useDisclosure } from "@chakra-ui/react";
import { MenuContent } from "../essentials/menuContents";
import { AiOutlinePoweroff } from "react-icons/ai";
import ModalLayout from "../../layout/modalLayout";
import ButtonInterface from "../essentials/button";
import { toast } from "react-toastify";
import { useState } from "react";

const DashboardSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loader, setLoader] = useState(false);

  const logOut = () => {
    setLoader(true);
    toast.success("Loged out successfully");

    setTimeout(() => {
      window.location.reload();
      window.location.href = "/";
      localStorage.removeItem("_authToken");
    }, 2000);
  };

  const closeModal = () => {
    onClose();
    setLoader(false);
  };
  return (
    <Box
      h={"100vh"}
      bg={"primary.100"}
      w={"300px"}
      px={"1em"}
      color={"#fff"}
      py={"1em"}
      position={"sticky"}
      top={0}
      bottom={0}
      left={0}
      zIndex={1}
    >
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        h={"90vh"}
        px={"2em"}
      >
        <Flex flexDir={"column"} gap={"2em"}>
          <MenuContent />
        </Flex>

        <Box
          w={"100%"}
          borderRadius={"10px"}
          px={"1em"}
          py={"0.6em"}
          display={"flex"}
          alignItems={"center"}
          gap={"0.5em"}
          textAlign={"center"}
          cursor={"pointer"}
          color={"red"}
          bg={"hsl(0deg 42.06% 50.72% / 8%)"}
          onClick={onOpen}
        >
          <AiOutlinePoweroff /> <Text>Log Out</Text>
        </Box>
      </Flex>

      <ModalLayout isOpen={isOpen} onClose={onClose} textAlign={"center"}>
        <Box textAlign={"center"}>
          <Text fontWeight={"bold"} fontSize={"1.3em"}>
            Do you want to continue ?
          </Text>
          <Text>By clicking continue will log you out</Text>

          <Flex w={"100%"} gap={"1em"} mt={"1.5em"} justifyContent={"center"}>
            <ButtonInterface
              w={"100%"}
              _hover={{}}
              bg={"gray.100"}
              color="black"
              onClick={closeModal}
            >
              Cancel
            </ButtonInterface>
            <ButtonInterface w={"100%"} onClick={logOut} loading={loader}>
              Continue
            </ButtonInterface>
          </Flex>
        </Box>
      </ModalLayout>
    </Box>
  );
};

export default DashboardSidebar;

//@ts-nocheck
import ModalLayout from "../../../../layout/modalLayout";
import { Box, Text, Flex, useDisclosure } from "@chakra-ui/react";
import ButtonInterface from "../../../../components/essentials/button";
import { useState, useEffect, ReactNode } from "react";
import { useFetch } from "../../../../utils/request";
import { FaTrash } from "react-icons/fa";
import moment from "moment";

const GroupSettlementTime = ({
  groupId,
  children,
}: {
  groupId: string;
  children: ReactNode;
}) => {
  const {
    isOpen: isSettlementDelete,
    onOpen: onSettlementDelete,
    onClose: closeSettlementDelete,
  } = useDisclosure();

  const { data: settlementData } = useFetch({
    endpoint: "agentgrouping/groupsettlementime/get",
    body: {
      agentGroup: groupId,
    },
  });

  console.log(settlementData);

  const styles = {
    fontWeight: "bold",
  };

  return (
    <>
      <Box>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text fontWeight={"600"} fontSize={"lg"}>
            Settlement Time
          </Text>
          <Box
            bg="red.100"
            w="fit-content"
            p=".5em"
            borderRadius={"10px"}
            cursor={"pointer"}
            onClick={onSettlementDelete}
          >
            <FaTrash />
          </Box>
        </Flex>
        <Box bg="gray.100" borderRadius={"10px"} py="1em" px="1em" my="1em">
          {settlementData?.length > 0 ? (
            settlementData?.map(settlement => (
              <Box>
                <Text>
                  Settlement Hour:{" "}
                  <span style={styles}>
                    {" "}
                    {moment(settlement?.settlementHour, "HH:mm").format(
                      "hh:mm A"
                    )}
                  </span>{" "}
                </Text>
              </Box>
            ))
          ) : (
            <>{children}</>
          )}
        </Box>
      </Box>
      <ModalLayout isOpen={isSettlementDelete} onClose={closeSettlementDelete}>
        <Box>Item will be deleted</Box>

        <Flex gap="1em">
          <ButtonInterface bg="gray" onClick={closeSettlementDelete}>
            Cancel
          </ButtonInterface>

          <ButtonInterface
            bg="red"
            onClick={() => alert("Delete is in progress")}
          >
            Continue
          </ButtonInterface>
        </Flex>
      </ModalLayout>
    </>
  );
};

export default GroupSettlementTime;

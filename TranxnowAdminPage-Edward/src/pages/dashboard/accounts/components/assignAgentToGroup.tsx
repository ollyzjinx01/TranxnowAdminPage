//@ts-nocheck
import {
  Box,
  Text,
  Select,
  Flex,
  useToast,
  Center,
  useDisclosure,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { useFetch, postData } from "../../../../utils/request";
import ButtonInterface from "../../../../components/essentials/button";
import { AUTH, NAIRA_SIGN } from "../../../../redux/constant";
import ModalLayout from "../../../../layout/modalLayout";
import { FC, useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";

interface IAgent {
  groupId: string;
}

interface ResponseStatus {
  posCharges: number;
  groupName: string;
  groupCode: string;
  fundWalletFee: number;
  tPlusOne: boolean;
  mobileTransfer: boolean;
  transferFee: number;
}

type TAgent = {
  agentId: string;
};
const AssignAgentToGroup: FC<TAgent> = ({ agentId }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [agentGroup, setAgentGroup] = useState<string>("");
  const [returnedAgentData, setReturnedAgentData] = useState();

  console.log(returnedAgentData);
  const toast = useToast();

  const assignAgentToGroup = async ({ groupId }: IAgent) => {
    setIsAssigning(true);
    try {
      const { response } = await postData({
        url: "agentgrouping/assignagentgroup/create",
        body: {
          agentGroup: agentGroup,
          agent: agentId,
        },
        header: {
          Authorization: `${AUTH}`,
        },
      });
      //@ts-ignore
      toast({
        title: "Group has been assigned successfully",
        status: "success",
        position: "top",
      });

      window.location.reload();
    } catch (err) {
      //@ts-ignore
      // toast({
      //   title: err?.message,
      //   status: "error",
      // });
    } finally {
      setIsAssigning(false);
    }
  };

  const removeAgentFromGroup = async () => {
    setIsRemoving(true);
    try {
      const { response } = await postData({
        url: "agentgrouping/assignagentgroup/update",
        body: {
          status: "01",
          _id: returnedAgentData?.assignAgentGroupId,
        },
        header: {
          Authorization: `${AUTH}`,
        },
      });
      //@ts-ignore
      toast({
        title: "Group removed successfully",
        status: "success",
        position: "top",
      });

      window.location.reload();
    } catch (err) {
      //@ts-ignore
      // toast({
      //   title: err?.message,
      //   status: "error",
      // });
    } finally {
      setIsRemoving(false);
    }
  };

  const { data: agentData } = useFetch({
    endpoint: "agentgrouping/group/get",
  });

  const agentResponseData = agentData;

  const getAgentData = e => {
    setIsDisabled(false);
    setAgentGroup(e.target.value);
  };

  useEffect(() => {
    const getAgentResponseData = async () => {
      setLoading(true);
      try {
        const { response } = await postData({
          url: "agentgrouping/getAgenWithId",
          body: {
            agent: agentId,
          },
          header: {
            Authorization: `${AUTH}`,
          },
          message: false,
        });

        setReturnedAgentData(response);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    getAgentResponseData();
  }, [agentId]);

  return (
    <Box>
      {loading ? (
        <HStack justify={"center"}>
          <Spinner size={"lg"} />
        </HStack>
      ) : (
        <>
          {!returnedAgentData ? (
            <Box
              textAlign={"center"}
              my="1em"
              p={["1.5em", "2em"]}
              bg="gray.100"
              borderRadius={"10px"}
            >
              <Text>Agent not assigned to a group</Text>

              <ButtonInterface mt="1em" onClick={onOpen}>
                Assign Group Now
              </ButtonInterface>
            </Box>
          ) : (
            <Box>
              <HStack align={"center"} justify={"space-between"}>
                <Text fontWeight={"bold"} fontSize={"15px"}>
                  Group Details
                </Text>
                {isRemoving ? (
                  <Text>Removing group...</Text>
                ) : (
                  <Box
                    bg="red.100"
                    w="fit-content"
                    p=".5em"
                    borderRadius={"10px"}
                    cursor={"pointer"}
                    onClick={removeAgentFromGroup}
                  >
                    <FaTrash />
                  </Box>
                )}
              </HStack>
              <Box
                my="1em"
                p={["1.5em", "2em"]}
                bg="gray.100"
                borderRadius={"10px"}
              >
                <Flex>
                  <Box
                    fontWeight={"500"}
                    display={"flex"}
                    gap="1em"
                    flexDir={"column"}
                  >
                    <Text>
                      Group Name : <span>{returnedAgentData?.groupName}</span>
                    </Text>
                    <Text>
                      Group Code : <span>{returnedAgentData?.groupCode} </span>{" "}
                    </Text>
                    <Text>
                      POS Charges :{" "}
                      <span>
                        {returnedAgentData?.posChargesInPercentage === false
                          ? `${NAIRA_SIGN}${returnedAgentData?.posCharges}`
                          : `${returnedAgentData?.posCharges}%`}
                      </span>{" "}
                    </Text>
                    <Text>
                      POS Capped At :{" "}
                      <span>
                        {returnedAgentData?.posChargesInPercentage === false
                          ? `${NAIRA_SIGN}${returnedAgentData?.posCharges}`
                          : `${NAIRA_SIGN}${returnedAgentData?.posChargesCappedAt}`}
                      </span>{" "}
                    </Text>
                    <Text>
                      Transfer Fee :{" "}
                      {returnedAgentData?.transferFeeInPercentage === false
                        ? `${NAIRA_SIGN}${returnedAgentData?.transferFee}`
                        : `${returnedAgentData?.transferFee}%`}
                    </Text>
                    <Text>
                      Transfer Capped At :{" "}
                      {returnedAgentData?.transferFeeInPercentage === false
                        ? `${NAIRA_SIGN}${returnedAgentData?.transferFee}`
                        : `${NAIRA_SIGN}${returnedAgentData?.transferFeeCappedAt}`}
                    </Text>
                    <Text>
                      Fund Wallet Fee :{" "}
                      <span>
                        {returnedAgentData?.fundWalletFeeInPercentage === false
                          ? `${NAIRA_SIGN}${returnedAgentData?.fundWalletFee}`
                          : `${returnedAgentData?.fundWalletFee}%`}
                      </span>
                    </Text>
                    <Text>
                      Fund Wallet Capped At :{" "}
                      <span>
                        {returnedAgentData?.fundWalletFeeInPercentage === false
                          ? `${NAIRA_SIGN}${returnedAgentData?.fundWalletFee}`
                          : `${NAIRA_SIGN}${returnedAgentData?.fundWalletFeeCappedAt}`}
                      </span>
                    </Text>
                    <Text>
                      Mobile Transfer :{" "}
                      <span>
                        {returnedAgentData?.mobileTransfer === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </Text>
                    <Text>
                      T Plus One :{" "}
                      <span>
                        {returnedAgentData?.tPlusOne === true ? "Yes" : "No"}
                      </span>
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          )}
        </>
      )}

      <ModalLayout isOpen={isOpen} onClose={onClose}>
        {/* assign group to agent  */}
        <Box my="3em">
          <Text fontWeight={"bold"}>Assign Agent Group</Text>

          <Box my="2em">
            <Text my=".5em" fontWeight={"medium"}>
              Select Agent
            </Text>

            <Select size={"lg"} onChange={e => getAgentData(e)}>
              <option value="">Select Agent</option>
              {/* @ts-ignore */}
              {agentResponseData?.map((data, key) => {
                return (
                  <option value={data?._id} key={key}>
                    {data?.groupName}
                  </option>
                );
              })}
            </Select>
            <Center>
              <ButtonInterface
                isDisabled={isDisabled}
                isLoading={isAssigning}
                my="1em"
                //@ts-ignore
                onClick={e => assignAgentToGroup({ groupId: "string" })}
              >
                Assign Agent
              </ButtonInterface>
            </Center>
          </Box>
        </Box>
      </ModalLayout>
    </Box>
  );
};

export default AssignAgentToGroup;

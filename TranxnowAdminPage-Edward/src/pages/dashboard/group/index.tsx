/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
  Box,
  Flex,
  Text,
  Tr,
  Td,
  useDisclosure,
  Badge,
  Select,
  FormLabel,
  Input,
  Stack,
  HStack,
} from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import ModalLayout from "../../../layout/modalLayout";
import { Fragment, useEffect, useState } from "react";
import InputArea from "../../../components/essentials/textInput";
import ButtonInterface from "../../../components/essentials/button";
import NoData from "../../../components/essentials/noData";
import { FaTrash, FaUserAltSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postData, useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import moment from "moment";
import { toast } from "react-toastify";
import { getTotalAdminUsers } from "../../../redux/slice/totalCountSlice";
import { useDispatch } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { AUTH, NAIRA_SIGN } from "../../../redux/constant";
import { STATUS } from "../../../enums/status";
import { IoIosTimer } from "react-icons/io";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { Center } from "@chakra-ui/react";
import DrawerLayout from "../../../layout/draweerLayout";
import GroupSettlementTime from "./component/groupSettlementTime";
import { createGroupingSchema } from "../../../_validations";
import SelectField from "../../../components/essentials/selectField";

const UserTop = (action: () => void) => {
  return (
    <Flex alignItems={"center"} gap="1.5em" justifyContent={"space-between"}>
      <Box>
        <Text>Grouping</Text>
      </Box>
      <ButtonInterface onClick={action} type={"button"}>
        Create Group
      </ButtonInterface>
    </Flex>
  );
};

const IndexGrouping = () => {
  const dispatch = useDispatch();
  const [agentID, setAgentID] = useState<string>("");
  console.log(agentID);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const {
    isOpen: isSettlementDrawer,
    onOpen: onSettlementDrawer,
    onClose: closeSettlementDrawer,
  } = useDisclosure();
  const {
    isOpen: isDrawer,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const payload = {
    groupname: "",
    posCharges: "",
    posChargesCappedAt: "",
    posChargesInPercentage: "",
    transferFeeInPercentage: "",
    transferFeeCappedAt: "",
    transferFee: "",
    fundWalletFeeCappedAt: "",
    fundWalletFeeInPercentage: "",
    fundWalletFee: "",
    mobileTransfer: "",
    tPlusOne: "",
    redeem: "",
  };
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: payload,
    validationSchema: createGroupingSchema,
    onSubmit: values => {
      createGroup(values);
    },
  });

  const defaultValue = {
    posService: {
      posChargesInPercentage: formik.values.posChargesInPercentage === "true",
      posCharges: +formik.values.posCharges,
      posChargesCappedAt:
        formik.values.posChargesInPercentage === "false"
          ? 0
          : +formik.values.posChargesCappedAt,
    },
    transferService: {
      transferFeeInPercentage: formik.values.transferFeeInPercentage === "true",
      transferFeeCappedAt:
        formik.values.transferFeeInPercentage === "false"
          ? 0
          : +formik.values.transferFeeCappedAt,
      transferFee: +formik.values.transferFee,
    },
    fundwalletService: {
      fundWalletFee: +formik.values.fundWalletFee,
      fundWalletFeeInPercentage:
        formik.values.fundWalletFeeInPercentage === "true",
      fundWalletFeeCappedAt:
        formik.values.fundWalletFeeInPercentage === "false"
          ? 0
          : +formik.values.fundWalletFeeCappedAt,
    },
    mobileTransfer: formik.values.mobileTransfer,
    tPlusOne: formik.values.tPlusOne === "true",
    redeem: formik.values.redeem === "true",
  };

  const createGroup = async (values: any) => {
    setLoading(true);
    try {
      const { response, decryted } = await postData({
        url: "agentgrouping/group/create",
        body: { ...values, ...defaultValue },
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });
      toast.success("User has been created successfully", {});
      // setTimeout(() => window.location.reload(), 1500);
      onClose();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDelete,
    onOpen: onDelete,
    onClose: closeDelete,
  } = useDisclosure();
  const {
    isOpen: isSettlement,
    onOpen: onSettlement,
    onClose: closeSettlement,
  } = useDisclosure();

  const topPart = UserTop(onOpen);

  const { data } = useFetch({ endpoint: "agentgrouping/group/get" });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  const deleteGrouping = async ({ id, name }: string) => {
    try {
      const { response, decryted } = await postData({
        url: "agentgrouping/group/update",
        body: {
          _id: id,
          status: STATUS.DELETE,
        },
        header: {
          Authorization: `${AUTH}`,
        },
      });

      toast.success("Group Deleted Successfully", {});
      setTimeout(() => closeDelete(), 1000);
    } catch (err) {
      console.log(err);
    }
  };

  interface IAgent {
    agendId: string;
    groupId: string;
  }

  const [timer, setTimer] = useState([{ time: "" }]);

  const addTimer = () => {
    const newTimer = {
      time: "",
    };

    setTimer([...timer, newTimer]);
  };

  const handleChange = (index: number, event: any) => {
    const name = event.target.name;
    const value = event.target.value;

    setTimer(items =>
      items.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleDeleteTime = (indexToDelete: number) => {
    // Filter the formItems array to remove the item at the specified index
    const deletedItem = timer[indexToDelete];
    setTimer(items => items.filter((_, index) => index !== indexToDelete));
  };

  const getTimeByUser = e => {
    const splitTime = e.target.value.split(":")[0];
    setTimer(splitTime);
    setIsDisabled(false);
  };

  const createGroupSettlementTime = async (_id: string) => {
    const splitTime = timer?.map(x => {
      return x?.time.split(":")[0];
    });

    try {
      const { response } = await postData({
        url: "agentgrouping/groupsettlementime/create",
        body: {
          agentGroup: _id,
          settlementHours: splitTime,
        },
        header: {
          Authorization: `${AUTH}`,
        },
      });
      toast.success("Settlement added successfully");
      setTimeout(() => closeSettlement(), 1000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout headerTop={topPart} tableId="assignGroupTable">
      <Box bg={"white"}>
        {itemData?.length > 0 ? (
          <>
            <DefaultTable
              tableId="assignGroupTable"
              tableHeader={[
                "S/N",
                "Name",
                "Group Code",
                "POS Charges",
                "POS Capped AT",
                "Transfer Fee",
                "Transfer Capped At",
                "Fund Wallet Fee",
                "Fund Wallet Capped At",
                "App Transfer ",
                "Same Day Settlement",
                "Date",
                "Actions",
              ]}
            >
              {itemData?.map((items, index) => {
                return (
                  <>
                    <Fragment key={index}>
                      <Tr>
                        <Td>{index + 1}</Td>
                        <Td>{items?.groupName}</Td>
                        <Td>{items?.groupCode}</Td>
                        <Td>
                          {items?.posChargesInPercentage === false
                            ? `${NAIRA_SIGN}${items?.posCharges}`
                            : `${items?.posCharges}%`}
                        </Td>

                        <Td>
                          {items?.posChargesInPercentage === false
                            ? `${NAIRA_SIGN}${items?.posCharges}`
                            : `${NAIRA_SIGN}${items?.posChargesCappedAt}`}
                        </Td>

                        <Td>
                          {items?.transferFeeInPercentage === false
                            ? `${NAIRA_SIGN}${items?.transferFee}`
                            : `${items?.transferFee}%`}
                        </Td>

                        <Td>
                          {items?.transferFeeInPercentage === false
                            ? `${NAIRA_SIGN}${items?.transferFee}`
                            : `${NAIRA_SIGN}${items?.transferFeeCappedAt}`}
                        </Td>

                        <Td>
                          {items?.fundWalletFeeInPercentage === false
                            ? `${NAIRA_SIGN}${items?.fundWalletFee}`
                            : `${items?.fundWalletFee}%`}
                        </Td>

                        <Td>
                          {items?.fundWalletFeeInPercentage === false
                            ? `${NAIRA_SIGN}${items?.fundWalletFee}`
                            : `${NAIRA_SIGN}${items?.fundWalletFeeCappedAt}`}
                        </Td>

                        <Td>{items?.mobileTransfer === true ? "Yes" : "No"}</Td>
                        <Td>{items?.tPlusOne === true ? "Yes" : "No"}</Td>

                        <Td>
                          {moment(items?.createdAt).format("MMM DD YYYY")}
                        </Td>
                        <Td>
                          <Flex gap="1em">
                            <RiDeleteBinLine
                              onClick={onDelete}
                              size="1.3em"
                              cursor="pointer"
                            />

                            <IoIosTimer
                              cursor="pointer"
                              size="1.3em"
                              // onClick={onSettlement}
                              onClick={() => {
                                onSettlementDrawer();
                                setAgentID(items?._id);
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>

                      <ModalLayout isOpen={isDelete} onClose={closeDelete}>
                        <Box py="1em" textAlign={"center"}>
                          <Text my="1em">
                            Are you sure, you want to delete this?
                          </Text>

                          <Flex gap=".5em" justifyContent="center">
                            <ButtonInterface bg="gray" onClick={closeDelete}>
                              Cancel
                            </ButtonInterface>
                            <ButtonInterface
                              bg="red"
                              onClick={e =>
                                deleteGrouping({
                                  id: items?._id,
                                  name: items?.groupName,
                                })
                              }
                            >
                              Continue
                            </ButtonInterface>
                          </Flex>
                        </Box>
                      </ModalLayout>
                    </Fragment>
                  </>
                );
              })}
            </DefaultTable>
          </>
        ) : (
          <NoData />
        )}
        <ModalLayout isOpen={isSettlement} onClose={closeSettlement}>
          <Text fontWeight={"bold"}>Assign Settlement</Text>
          <Box py="1em" textAlign={"center"}>
            <Stack spacing={2}>
              {timer?.map((timer, index) => (
                <HStack>
                  <Input
                    borderColor={"#555"}
                    name="time"
                    value={timer?.time}
                    size={"lg"}
                    type="time"
                    onChange={e => handleChange(index, e)}
                  />

                  {index !== 0 && (
                    <FaTrash
                      onClick={() => handleDeleteTime(index)}
                      cursor="pointer"
                      color={"red"}
                    />
                  )}
                </HStack>
              ))}
              <Text onClick={addTimer}>Add more +</Text>
            </Stack>
            <Flex gap=".5em" my={".8em"} justifyContent="center">
              <ButtonInterface
                // isDisabled={isDisabled}
                onClick={() => createGroupSettlementTime(agentID)}
              >
                Assign Settlement
              </ButtonInterface>
            </Flex>
          </Box>
        </ModalLayout>
        <DrawerLayout
          isOpen={isSettlementDrawer}
          onClose={closeSettlementDrawer}
          size="md"
        >
          <GroupSettlementTime groupId={agentID}>
            <Box textAlign={"center"}>
              <Text>No Settlement set for this</Text>
              <ButtonInterface my="1em" onClick={onSettlement}>
                Assign Settlement
              </ButtonInterface>
            </Box>
          </GroupSettlementTime>
        </DrawerLayout>
      </Box>

      <DrawerLayout isOpen={isOpen} onClose={onClose} size="xl">
        <form onSubmit={formik.handleSubmit}>
          <Box my={"1.5em"}>
            <InputArea
              isError={formik.errors.groupname ? formik.errors.groupname : ""}
              isInvalid={formik.errors.groupname ? formik.errors.groupname : ""}
              type="text"
              name="groupname"
              placeholder="Enter group name"
              label="Group Name"
              onChange={formik.handleChange}
            />
          </Box>

          <Box>
            <Flex alignItems={"center"} gap="1em" w="full">
              <Box width={"100%"}>
                <SelectField
                  name="posChargesInPercentage"
                  label="Charge in Percentage"
                  onChange={formik.handleChange}
                  size={"lg"}
                  cursor={"pointer"}
                >
                  <option value="">Select </option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </SelectField>
              </Box>

              <InputArea
                name="posCharges"
                step="0.01"
                placeholder="Pos Charges"
                text="number"
                isError={
                  formik.errors.posCharges ? formik.errors.posCharges : ""
                }
                isInvalid={
                  formik.errors.posCharges ? formik.errors.posCharges : ""
                }
                type="number"
                name="posCharges"
                placeholder="POS Charges"
                label="POS Charges"
                onChange={formik.handleChange}
              />

              <InputArea
                isError={
                  formik.errors.posChargesCappedAt
                    ? formik.errors.posChargesCappedAt
                    : ""
                }
                isInvalid={
                  formik.errors.posChargesCappedAt
                    ? formik.errors.posChargesCappedAt
                    : ""
                }
                type="number"
                step="0.01"
                name="posChargesCappedAt"
                placeholder="POS Cap At"
                label="Capped At"
                onChange={formik.handleChange}
                isDisabled={
                  formik.values.posChargesInPercentage === "false"
                    ? true
                    : false
                }
                // value={formik.values.posChargesInPercentage === "false" ? formik.values.posCharges : ""}
              />

              {formik.values.posChargesInPercentage === "true" && <></>}
            </Flex>
            {/* Transfer fee options */}
            <Flex alignItems={"center"} gap="1em" w="full">
              <Box width={"100%"}>
                <SelectField
                  name="transferFeeInPercentage"
                  label="Transfer Fee in Percentage"
                  onChange={formik.handleChange}
                  size={"lg"}
                  cursor={"pointer"}
                >
                  <option value="">Select </option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </SelectField>
              </Box>

              <InputArea
                isError={
                  formik.errors.transferFee ? formik.errors.transferFee : ""
                }
                isInvalid={
                  formik.errors.transferFee ? formik.errors.transferFee : ""
                }
                type="number"
                step="0.01"
                name="transferFee"
                placeholder="Transfer Fee"
                label="Transfer Fee"
                onChange={formik.handleChange}
              />

              <InputArea
                isError={
                  formik.errors.transferFeeCappedAt
                    ? formik.errors.transferFeeCappedAt
                    : ""
                }
                isInvalid={
                  formik.errors.transferFeeCappedAt
                    ? formik.errors.transferFeeCappedAt
                    : ""
                }
                type="number"
                step="0.01"
                name="transferFeeCappedAt"
                placeholder="Transfer Fee Cap At"
                label="Transfer Fee At"
                onChange={formik.handleChange}
                isDisabled={
                  formik.values.transferFeeInPercentage === "false"
                    ? true
                    : false
                }
                //value={formik.values.transferFeeInPercentage === "false" ? formik.values.transferFee : ""}
              />

              {/* {formik.values.transferFeeInPercentage === "true" && (
                <>
          

                </>
              )} */}
            </Flex>
            {/* Funwallet service options */}
            <Flex alignItems={"center"} gap="1em" w="full">
              <Box width={"100%"}>
                <SelectField
                  name="fundWalletFeeInPercentage"
                  label="Fund Wallet Fee in Percentage"
                  onChange={formik.handleChange}
                  size={"lg"}
                  cursor={"pointer"}
                >
                  <option value="">Select </option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </SelectField>
              </Box>

              <InputArea
                isError={
                  formik.errors.fundWalletFee ? formik.errors.fundWalletFee : ""
                }
                isInvalid={
                  formik.errors.fundWalletFee ? formik.errors.fundWalletFee : ""
                }
                type="number"
                step="0.01"
                name="fundWalletFee"
                placeholder="Transfer Fee"
                label="Transfer Fee"
                onChange={formik.handleChange}
              />

              <InputArea
                isError={
                  formik.errors.fundWalletFeeCappedAt
                    ? formik.errors.fundWalletFeeCappedAt
                    : ""
                }
                isInvalid={
                  formik.errors.fundWalletFeeCappedAt
                    ? formik.errors.fundWalletFeeCappedAt
                    : ""
                }
                type="number"
                step="0.01"
                name="fundWalletFeeCappedAt"
                placeholder="Fund Wallet At"
                label="Fund wallet At"
                onChange={formik.handleChange}
                isDisabled={
                  formik.values.fundWalletFeeInPercentage === "false"
                    ? true
                    : false
                }
                // value={formik.values.fundWalletFeeInPercentage === "false" ? formik.values.fundWalletFeeAt : ""}
              />

              {/* {formik.values.fundWalletFeeInPercentage === "true" && (
                <>
               
                </>
              )} */}
            </Flex>

            <Flex alignItems={"center"} my=".5em" gap="1em" w="full">
              <Box width={"100%"}>
                <SelectField
                  name="tPlusOne"
                  label="Same Day Settlement"
                  onChange={formik.handleChange}
                  size={"lg"}
                  cursor={"pointer"}
                >
                  <option value="">Select </option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </SelectField>
              </Box>

              <Box width={"100%"}>
                <SelectField
                  name="mobileTransfer"
                  label="Mobile Transfer"
                  onChange={formik.handleChange}
                  size={"lg"}
                  cursor={"pointer"}
                >
                  <option value="">Select </option>
                  <option value={"00"}>Yes</option>
                  <option value={"01"}>No</option>
                </SelectField>
              </Box>
            </Flex>

            <Box width={"100%"}>
              <SelectField
                name="redeem"
                label="Marchant Redemption"
                onChange={formik.handleChange}
                size={"lg"}
                cursor={"pointer"}
              >
                <option value="">Select </option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </SelectField>
            </Box>
          </Box>

          <Flex gap={"1em"} justifyContent={"center"} w="100%" mt="1.3em">
            <ButtonInterface w="full" type={"submit "} loading={loading}>
              Submit
            </ButtonInterface>
            <ButtonInterface
              w="full"
              onClick={onClose}
              type={"button"}
              bg="gray.300"
              color={"black"}
            >
              Cancel
            </ButtonInterface>
          </Flex>
        </form>
      </DrawerLayout>
    </DashboardLayout>
  );
};
export default IndexGrouping;

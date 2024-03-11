/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { postData, useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import {
  Td,
  Tr,
  Badge,
  Text,
  Box,
  Center,
  Button,
  useDisclosure,
  Select,
  FormControl,
  FormErrorMessage,
  FormErrorIcon,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import { FiMoreVertical } from "react-icons/fi";
import { FaEdit, FaEye, FaPencilAlt } from "react-icons/fa";
import ModalLayout from "../../../layout/modalLayout";
import InputArea from "../../../components/essentials/textInput";
import ButtonInterface from "../../../components/essentials/button";
import { CustomData } from "../../../interface";
import { toast } from "react-toastify";
import DrawerLayout from "../../../layout/draweerLayout";
import * as Yup from "yup";
import { useFormik } from "formik";
import { decrypt } from "decrypt-core";
import { DECRYPTIONKEY } from "../../../redux/constant";
import AgentHistories from "./subs/history";
import { useSelector } from "react-redux";
import ListSettlement from "./subs/settlementLists";
import Pagination from "../../../components/atoms/pagination";
import useSearchFilter from "../../../hooks/useSearch";
import useExportPDF from "../../../hooks/useExportToPDF";
import AssignAgentToGroup from "./components/assignAgentToGroup";

const validateSettlement = Yup.object().shape({
  selectHour: Yup.number().required(),
  bankCode: Yup.string().required("Bank is required"),
  numban: Yup.string().required().max(10),
});

const AccountAgent = () => {
  const [customData, setCustomData] = useState<CustomData>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [itemData, setItemData] = useState([]);
  const [values, setValues] = useState({});
  const [accountName, setAccountName] = useState();
  const [agent_id, setAgentId] = useState("");
  const [_id, setId] = useState("");
  const [checking, setchecking] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editItems, setEditItems] = useState({});
  const [isError, setError] = useState(false);
  const [settlementDetails, setSettlementDetails] = useState({});

  const [nextPrev, setNextPrev] = useState(1);
  const addon = 10;
  const [countIndex, setCountIndex] = useState(1);

  const nextPage = () => {
    setNextPrev(nextPrev + 1);
    setCountIndex(countIndex + addon);
  };
  const prevPage = () => {
    setNextPrev(nextPrev - 1);
    setCountIndex(countIndex - addon);
  };

  const {
    isOpen: isNote,
    onOpen: onNote,
    onClose: closeNote,
  } = useDisclosure();

  const {
    isOpen: isSettlement,
    onOpen: onSettlement,
    onClose: closeSettlement,
  } = useDisclosure();

  const {
    isOpen: isLayoutOpen,
    onOpen: onLayoutOpen,
    onClose: onLayoutClose,
  } = useDisclosure();

  const {
    isOpen: isList,
    onOpen: onList,
    onClose: closeList,
  } = useDisclosure();

  const {
    isOpen: isGroup,
    onOpen: onGroup,
    onClose: closeGroup,
  } = useDisclosure();

  const assignGroup = (id: string) => {
    setId(id);
    onGroup();
  };

  const header = [
    "S/N",
    "Terminal ID",
    "Reg Code",
    "Serial No.",
    "Business Name",
    "Account Manager",
    "Email",
    "Phone",
    "State",
    "LGA",
    "Status",
    "Edit",
    "Settlement",
    "Transactions",
    "View",
  ];

  const { data } = useFetch({
    endpoint: "admin/account/agent/get",
    body: {
      _populate: "agentManager,user",
      _page: nextPrev,
      _pagelimit: 10,
    },
    nextPrev: nextPrev,
  });

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data, nextPrev]);

  interface IModalStructure {
    sn?: string;
    _id?: string;
    terminal_id?: string;
  }

  const openModal = ({ sn, _id, terminal_id }: IModalStructure) => {
    onOpen();
    setCustomData({
      serialNo: sn,
      terminalId: terminal_id,
      agentId: _id,
    });
  };

  const openSettlement = ({ sn, _id, terminal_id }: IModalStructure) => {
    onSettlement();
    setchecking(false);
    setCustomData({
      serialNo: sn,
      terminalId: terminal_id,
      agentId: _id,
    });
  };

  const handleChange = e => {
    const { value, name } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const payloads = {
    agent_id: customData?.agentId,
    ...values,
  };

  const editAgent = async e => {
    e.preventDefault();

    setLoader(true);
    try {
      const { response, decryted } = await postData({
        url: "admin/account/agent/update",

        body: payloads,
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      toast.success("User has been created successfully");
      window.location.reload();
      onClose();
    } catch (err) {
      return;
    } finally {
      setLoader(false);
    }
  };

  const settlementPayload = {
    ...values,
    agent_id: customData?.agentId,
    numban: values.numban,
    bankCode: values.bankCode,
  };

  //create marchant account
  const createSettlementAcc = async values => {
    const { selectHour, bankCode, numban } = values;

    setLoader(true);
    const payloads = {
      agent: customData?.agentId || settlementDetails?._id,
      selectHour: Number(selectHour),
      bankCode: bankCode.toString(),
      numban: numban.toString(),
      accountName: accountName,
    };

    try {
      const { response, decryted } = await postData({
        url: "admin/merchantsettlement/create",

        body: payloads,
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      toast.success("User has been created successfully");
      window.location.reload();
      onClose();
    } catch (err) {
      const error = err;
      return error;
    } finally {
      setLoader(false);
    }
  };

  const formik = useFormik({
    initialValues: settlementPayload,
    validateOnChange: true,
    validationSchema: validateSettlement,
    onSubmit: createSettlementAcc,
  });

  const accountLookup = async () => {
    const { bankCode, numban } = formik.values;
    const data = {
      bankCode: bankCode,
      accountNumber: numban,
    };

    try {
      setchecking(true);
      const { response } = await postData({
        url: "admin/accountlookup",
        body: data,
        message: false,
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      // const decode = decrypt(response, DECRYPTIONKEY);
      // const accName = decode?.accountname;
      setAccountName(response?.accountname);
      setError(false);
    } catch (err) {
      const error = err?.response?.data?.message;
      setError(true);
      return setAccountName(error);
    } finally {
      setchecking(false);
    }
  };

  useEffect(() => {
    if (formik.values.numban?.length >= 10 && formik.values.bankCode) {
      accountLookup();
    }
  }, [formik.values.numban, formik.values.bankCode]);

  const { totalBankList } = useSelector(state => state.getTotalItems);

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData([
    "businessdata",
    "agentManager",
    "terminalID",
    "is_blocked",
    "serialnumber",
  ]);

  const searchForData = event => {
    setSearchTerm(event.target.value);
  };

  const exportPDF = useExportPDF();

  const exportDataToPdf = () => {
    exportPDF(data, header, "Data-Transactions.pdf");
  };

  return (
    <DashboardLayout
      tableId="accountAgentTable"
      headerTop={"Account Agent"}
      onSearch={searchForData}
      exportToPDF={exportDataToPdf}
    >
      {filteredData?.length === 0 ? (
        <NoData />
      ) : (
        <>
          <DefaultTable tableHeader={header} tableId="accountAgentTable">
            {filteredData?.map(
              (
                {
                  user,
                  businessdata,
                  agentManager,
                  terminalID,
                  is_blocked,
                  serialnumber,
                  _id,
                },
                index
              ) => {
                return (
                  <Tr key={index} cursor={"pointer"}>
                    <Td>{index + countIndex}</Td>
                    <Td>{terminalID ? terminalID : "No Terminal ID"}</Td>
                    <Td>{agentManager?.refCode}</Td>
                    <Td>{serialnumber ? serialnumber : "Empty"}</Td>
                    <Td>{businessdata?.busnessName}</Td>
                    <Td>{user?.customerName}</Td>
                    <Td>{user?.email}</Td>
                    <Td>{user?.phone}</Td>
                    <Td>{businessdata?.city}</Td>
                    <Td>{businessdata?.lga}</Td>
                    <Td>
                      {is_blocked === true ? (
                        <Badge
                          colorScheme="red"
                          py={".3em"}
                          rounded={"1.5em"}
                          px={"2em"}
                        >
                          Blocked
                        </Badge>
                      ) : (
                        <Badge
                          colorScheme="green"
                          py={".3em"}
                          rounded={"1.5em"}
                          px={"2em"}
                        >
                          Active
                        </Badge>
                      )}
                    </Td>

                    <Td
                      onClick={e => {
                        onNote();
                        setValues({
                          serialnumber,
                          terminalID,
                        });
                        setEditItems({
                          sn: serialnumber,
                          terminal_id: terminalID,
                          _id: _id,
                        });
                      }}
                    >
                      <FaPencilAlt />
                    </Td>

                    <Td
                      onClick={e => {
                        onList();
                        setSettlementDetails({
                          sn: serialnumber,
                          terminal_id: terminalID,
                          _id: _id,
                        });
                      }}
                    >
                      <Button>Add</Button>
                    </Td>

                    <Td>
                      <Button onClick={() => assignGroup(_id)}>
                        Assign Group
                      </Button>
                    </Td>

                    <Td
                      onClick={() => {
                        onLayoutOpen();
                        // setAgentId(_id);
                        setAgentId(user?._id);
                      }}
                    >
                      <FaEye />
                    </Td>
                  </Tr>
                );
              }
            )}

            <Pagination
              disabledPrev={nextPrev === 1 ? true : false}
              nextPage={nextPage}
              prev={prevPage}
            />
          </DefaultTable>
        </>
      )}

      {/* Assign Agent to a group  */}
      <DrawerLayout size="md" isOpen={isGroup} onClose={closeGroup}>
        <AssignAgentToGroup agentId={_id} />
      </DrawerLayout>

      <ModalLayout isOpen={isOpen} onClose={onClose}>
        <Text fontWeight={"600"}>{"Edit Agent"}</Text>
        <form onSubmit={e => editAgent(e)}>
          <InputArea
            placeholder="Terminal ID"
            name="terminalID"
            value={values?.terminalID || undefined}
            onChange={handleChange}
          />
          <InputArea
            onChange={handleChange}
            name={"serialnumber"}
            placeholder="Searial Number"
            value={values?.serialnumber || undefined}
          />

          <ButtonInterface width="100%" type={"submit"} loading={loader}>
            Update
          </ButtonInterface>
        </form>
      </ModalLayout>

      <ModalLayout isOpen={isSettlement} onClose={closeSettlement}>
        <Text fontWeight={"600"}>Add Settlement Details</Text>
        <form onSubmit={formik.handleSubmit}>
          <InputArea
            placeholder="Account Number"
            name="numban"
            label="Account Number"
            type="string"
            onChange={formik.handleChange}
            isInvalid={formik.errors.numban ? true : false}
            isError={formik.errors.numban}
          />

          <FormControl isInvalid={formik.errors.bankCode ? true : false}>
            <Select size={"lg"} name="bankCode" onChange={formik.handleChange}>
              <option value="">Select Bank</option>
              {totalBankList?.map((item, index) => {
                return (
                  <option key={index} value={item?.bank_code}>
                    {item?.name}
                  </option>
                );
              })}
            </Select>

            <FormErrorMessage>
              <FormErrorIcon /> {formik.errors.bankCode}
            </FormErrorMessage>

            <Box my={"1em"}>
              {checking ? (
                <Flex gap={".6em"}>
                  <Spinner /> Checking account validity
                </Flex>
              ) : (
                <Box mt={"1em"}>
                  {isError !== true ? (
                    <Text color={"green"}>{accountName}</Text>
                  ) : (
                    <Text color={"red"}>Invalid Account</Text>
                  )}
                </Box>
              )}
            </Box>
          </FormControl>

          <FormControl
            mb={"1em"}
            isInvalid={formik.errors.selectHour ? true : false}
          >
            <Select
              size={"lg"}
              name={"selectHour"}
              onChange={formik.handleChange}
            >
              <option value="">Select Hour</option>
              {Array.from({ length: 24 }).map((_, index) => {
                const hours = index + 1;
                return (
                  <option key={hours} value={hours}>
                    {hours} {hours === 1 ? "Hour" : "Hours"}
                  </option>
                );
              })}
            </Select>
            {/* <InputArea
              placeholder="Account Number"
              name="numban"
              label="Account Number"
              type="time"
              onChange={formik.handleChange}
              isInvalid={formik.errors.numban ? true : false}
              isError={formik.errors.numban}
            /> */}

            <FormErrorMessage>
              <FormErrorIcon /> {formik.errors.selectHour}
            </FormErrorMessage>
          </FormControl>

          <ButtonInterface
            disabled={true}
            width="100%"
            type={
              accountName !== "default" || accountName !== "false"
                ? "submit"
                : "button"
            }
            loading={loader}
          >
            Create Settlement
          </ButtonInterface>
        </form>
      </ModalLayout>

      <ModalLayout isOpen={isNote} onClose={closeNote}>
        <Text fontWeight={"600"} fontSize={"1.1em"} textAlign={"center"}>
          Do you want to continue ?
        </Text>

        <Text my={"0.5em"}>
          By clicking "Continue," you can proceed to edit agent
        </Text>

        <Flex mt={"1em"} gap={"1em"}>
          <Button w={"100%"} py={"1.4em"} onClick={() => closeNote()}>
            Cancel
          </Button>

          <Button
            w={"100%"}
            bg={"primary.100"}
            py={"1.4em"}
            color={"#fff"}
            _hover={{}}
            onClick={() => openModal(editItems)}
          >
            Continue
          </Button>
        </Flex>
      </ModalLayout>

      <DrawerLayout size="full" isOpen={isLayoutOpen} onClose={onLayoutClose}>
        <AgentHistories _id={agent_id} />
      </DrawerLayout>

      <DrawerLayout size="sm" isOpen={isList} onClose={closeList}>
        <ListSettlement onClick={onSettlement} _id={settlementDetails?._id} />
      </DrawerLayout>
    </DashboardLayout>
  );
};

export default AccountAgent;

/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { postData, useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import {
  Td,
  Tr,
  Flex,
  Text,
  Box,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import { FiEdit, FiMoreVertical } from "react-icons/fi";
import ButtonInterface from "../../../components/essentials/button";
import ModalLayout from "../../../layout/modalLayout";
import InputArea from "../../../components/essentials/textInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import { CustomData } from "../../../interface";

const AccountHeader = (action: () => void) => {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Box>
        <Text>Agent Managers</Text>
      </Box>

      <ButtonInterface onClick={action} type={"button"}>
        Add Agent Manager
      </ButtonInterface>
    </Flex>
  );
};

const AccountManager = () => {
  const validationSchema = Yup.object().shape({
    regcode: Yup.string()
      .required("Reg Code is required")
      .min(3, "Regcode is too short"),
  });

  const payload = {
    regcode: "",
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [customData, setCustomData] = useState<CustomData>({});
  const [loader, setLoader] = useState<boolean>(false);

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

  const { data } = useFetch({
    endpoint: "admin/account/getAgentManager",
    body: {
      _populate: "user",
    },
  });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  const createManager = async values => {
    setLoading(true);
    try {
      const { response, decryted } = await postData({
        url: "admin/account/createAgentManager",
        body: values,
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      toast.success("User has been created successfully", {});
      window.location.reload();
      onClose();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: payload,
    validationSchema: validationSchema,
    onSubmit: createManager,
  });
  const topPart = AccountHeader(onOpen);

  const header = [
    "S/N",
    "RegCode",
    "Customer Name",
    "Email",
    "Phone Number",
    "Status",
    "Date",
  ];

  const {
    isOpen: isEdit,
    onOpen: onEdit,
    onClose: closeEdit,
  } = useDisclosure();

  interface IModalStructure {
    sn?: string;
    _id?: string;
    terminal_id?: string;
  }

  const openModal = ({ sn, _id, terminal_id }: IModalStructure) => {
    onEdit();
    setCustomData({
      serialNo: sn,
      terminalId: terminal_id,
      agentId: _id,
    });
  };

  const [values, setValues] = useState({});

  const handleChange = e => {
    const { value, name } = e.target;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const payloads = {
    agentManagerId: customData?.agentId,
    ...values,
  };

  const editAgentManager = async e => {
    e.preventDefault();

    setLoader(true);
    try {
      const { response, decryted } = await postData({
        url: "admin/account/updateAgentManager",
        body: payloads,
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      toast.success(" status updated successfully");
      setTimeout(() => window.location.reload(), 1500);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  console.log(itemData);
  return (
    <DashboardLayout headerTop={topPart} tableId="accountManagerTable">
      {itemData.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="accountManagerTable">
          {itemData.map(({ user, createdAt, is_suspended, _id }, index) => {
            return (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{user?.refCode}</Td>
                <Td>{user?.customerName}</Td>
                <Td>{user?.email}</Td>
                <Td>{user?.phone}</Td>

                <Td onClick={() => openModal({ _id: _id })} cursor={"pointer"}>
                  {is_suspended ? (
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

                <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
              </Tr>
            );
          })}
        </DefaultTable>
      )}

      <ModalLayout isOpen={isOpen} onClose={onClose}>
        <form onSubmit={formik.handleSubmit}>
          <Box my={"1.5em"}>
            <InputArea
              type="tel"
              isError={formik.errors.regcode ? formik.errors.regcode : ""}
              isInvalid={formik.errors.regcode ? formik.errors.regcode : ""}
              name="regcode"
              placeholder="Enter regcode"
              label="Regcode"
              onChange={formik.handleChange}
            />
          </Box>

          <Flex gap={"1em"} justifyContent={"flex-end"}>
            <ButtonInterface type={"submit "} loading={loading}>
              Submit
            </ButtonInterface>
            <ButtonInterface
              onClick={() => {
                setLoading(false);
                onClose();
              }}
              type={"button"}
              bg="gray.300"
              color={"black"}
            >
              Cancel
            </ButtonInterface>
          </Flex>
        </form>
      </ModalLayout>

      <ModalLayout isOpen={isEdit} onClose={closeEdit}>
        <form onSubmit={editAgentManager}>
          <Text fontWeight={"600"}>Update Status</Text>
          <Box my={"1.5em"}>
            <InputArea
              type="number"
              name="status"
              placeholder="Enter Status Code"
              label="Status"
              onChange={handleChange}
            />
          </Box>

          <Flex gap={"1em"} justifyContent={"flex-end"}>
            <ButtonInterface width="100%" type={"submit "} loading={loader}>
              Update
            </ButtonInterface>
          </Flex>
        </form>
      </ModalLayout>
    </DashboardLayout>
  );
};

export default AccountManager;

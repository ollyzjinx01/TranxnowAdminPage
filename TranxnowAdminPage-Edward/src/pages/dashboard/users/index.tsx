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
} from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import ModalLayout from "../../../layout/modalLayout";
import { useEffect, useState } from "react";
import InputArea from "../../../components/essentials/textInput";
import ButtonInterface from "../../../components/essentials/button";
import NoData from "../../../components/essentials/noData";
import { FaUserAltSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postData, useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import moment from "moment";
import { toast } from "react-toastify";
import { getTotalAdminUsers } from "../../../redux/slice/totalCountSlice";
import { useDispatch } from "react-redux";
import useSearchFilter from "../../../hooks/useSearch";
import useExportPDF from "../../../hooks/useExportToPDF";

const UserTop = (action: () => void) => {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Box>
        <Text>Users</Text>
      </Box>

      <ButtonInterface onClick={action} type={"button"}>
        Add Users
      </ButtonInterface>
    </Flex>
  );
};

const Usersers = () => {
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid Format"),
    phonenumber: Yup.string()
      .required("Phone number is required")
      .min(11, "Number cant be less than 11 digits")
      .max(11, "Number cant be greater than 11 digits"),
    password: Yup.string().required("Password is required"),
  });

  const payload = {
    email: "",
    phonenumber: "",
    password: "",
  };
  const [loading, setLoading] = useState<boolean>(false);

  const createUser = async (values: any) => {
    setLoading(true);
    try {
      const { response, decryted } = await postData({
        url: "admin/user/create",
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
    onSubmit: values => {
      createUser(values);
    },
  });

  const header = ["S/N", "Email", "Phone Number", "Status", "Date"];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const topPart = UserTop(onOpen);

  const { data } = useFetch({ endpoint: "admin/user/get" });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
      dispatch(getTotalAdminUsers(itemData?.length));
    }
  }, [data]);

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData([
    "S/N",
    "Email",
    "Phone Number",
    "Status",
    "Date",
    "is_blocked",
    "phonenumber",
  ]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const exportPDF = useExportPDF();

  const exportDataToPdf = () => {
    exportPDF(data, header, "post_transaction.pdf");
  };

  return (
    <DashboardLayout
      tableId="usersTable"
      headerTop={topPart}
      exportToPDF={exportDataToPdf}
      onSearch={handleSearchChange}
    >
      <Box bg={"white"}>
        {filteredData?.length === 0 ? (
          <Text fontWeight={"bold"} fontSize={["18px", "20px"]}>
            <NoData icon={<FaUserAltSlash size={"2em"} />} />
          </Text>
        ) : (
          <DefaultTable tableHeader={header} tableId="usersTable">
            {filteredData?.map(
              ({ email, phonenumber, createdAt, is_blocked }, index) => {
                return (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{email}</Td>
                    <Td>{phonenumber}</Td>
                    <Td>
                      {!is_blocked ? (
                        <Badge
                          Badge
                          colorScheme="green"
                          px={"1.8em"}
                          py={".3em"}
                          borderRadius={"10px"}
                        >
                          {" "}
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          Badge
                          colorScheme="red"
                          px={"1.8em"}
                          py={".3em"}
                          borderRadius={"10px"}
                        >
                          Blocked
                        </Badge>
                      )}
                    </Td>
                    <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                  </Tr>
                );
              }
            )}
          </DefaultTable>
        )}
      </Box>

      <ModalLayout isOpen={isOpen} onClose={onClose}>
        <form onSubmit={formik.handleSubmit}>
          <Box my={"1.5em"}>
            <InputArea
              isError={formik.errors.email ? formik.errors.email : ""}
              isInvalid={formik.errors.email ? formik.errors.email : ""}
              type="email"
              name="email"
              placeholder="Enter email address"
              label="Email"
              onChange={formik.handleChange}
            />

            <InputArea
              type="tel"
              isError={
                formik.errors.phonenumber ? formik.errors.phonenumber : ""
              }
              isInvalid={
                formik.errors.phonenumber ? formik.errors.phonenumber : ""
              }
              name="phonenumber"
              placeholder="Enter phone number"
              label="Phone Number"
              onChange={formik.handleChange}
            />

            <InputArea
              isError={formik.errors.password}
              isInvalid={formik.errors.password ? formik.errors.password : ""}
              type="password"
              name="password"
              placeholder="*******"
              label="Password"
              onChange={formik.handleChange}
            />
          </Box>

          <Flex gap={"1em"} justifyContent={"flex-end"}>
            <ButtonInterface type={"submit "} loading={loading}>
              Submit
            </ButtonInterface>
            <ButtonInterface
              onClick={onClose}
              type={"button"}
              bg="gray.300"
              color={"black"}
            >
              Cancel
            </ButtonInterface>
          </Flex>
        </form>
      </ModalLayout>
    </DashboardLayout>
  );
};
export default Usersers;

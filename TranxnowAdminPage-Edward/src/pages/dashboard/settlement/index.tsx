/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useEffect, useState } from "react";
import InputArea from "../../../components/essentials/textInput";
import ButtonInterface from "../../../components/essentials/button";
import NoData from "../../../components/essentials/noData";

import { useFormik } from "formik";
import * as Yup from "yup";
import { postData, useFetch } from "../../../utils/request";

import { toast } from "react-toastify";
import { getTotalAdminUsers } from "../../../redux/slice/totalCountSlice";
import { useDispatch } from "react-redux";
import ModalLayout from "../../../layout/modalLayout";
import DefaultTable from "../../../components/essentials/defaultTable";

const UserTop = (action: () => void) => {
  return (
    <Flex alignItems={"center"} gap="1.5em" justifyContent={"space-between"}>
      <Box>
        <Text>Settlements</Text>
      </Box>

      <ButtonInterface onClick={action} type={"button"}>
        Create Settlement
      </ButtonInterface>
    </Flex>
  );
};

const IndexSettlement = () => {
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    numbam: Yup.string().required("Number is required"),
  });

  const payload = {
    numbam: "",
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const topPart = UserTop(onOpen);

  const { data } = useFetch({ endpoint: "admin/merchantsettlement/get" });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
      dispatch(getTotalAdminUsers(itemData?.length));
    }
  }, [data]);

  return (
    <DashboardLayout headerTop={topPart} tableId="settlementTable">
      <Box bg={"white"}>
        {itemData?.length === 0 ? (
          <Text fontWeight={"bold"} fontSize={["18px", "20px"]}>
            <NoData />
          </Text>
        ) : (
          <DefaultTable
            tableId="settlementTable"
            tableHeader={["S/N", "Email", "Phone Number", "Status", "Date"]}
          >
            {/* {itemData &&
              itemData?.map((items, index) => {
                return (
                  <Tr key={index}>
                    <Td>{index}</Td>
                    <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                  </Tr>
                );
              })} */}
          </DefaultTable>
        )}
      </Box>

      <ModalLayout isOpen={isOpen} onClose={onClose}>
        <form onSubmit={formik.handleSubmit}>
          <Box my={"1.5em"}>
            <InputArea
              isError={formik.errors.email ? formik.errors.email : ""}
              isInvalid={formik.errors.email ? formik.errors.email : ""}
              type="number"
              name="nubam"
              placeholder="Enter number"
              label="Number"
              onChange={formik.handleChange}
            />
          </Box>

          <Box my={"1.5em"}>
            <InputArea
              isError={formik.errors.email ? formik.errors.email : ""}
              isInvalid={formik.errors.email ? formik.errors.email : ""}
              type="number"
              name="nubam"
              placeholder="Enter number"
              label="Bank Code"
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
export default IndexSettlement;

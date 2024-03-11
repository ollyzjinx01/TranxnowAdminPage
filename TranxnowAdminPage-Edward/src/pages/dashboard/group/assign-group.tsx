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
import { Fragment, useEffect, useState } from "react";
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
import { RiDeleteBinLine } from "react-icons/ri";
import { AUTH } from "../../../redux/constant";
import { STATUS } from "../../../enums/status";
import { IoIosTimer } from "react-icons/io";

const UserTop = (action: () => void) => {
  return (
    <Flex alignItems={"center"} gap="1.5em" justifyContent={"space-between"}>
      <Box>
        <Text>Grouping</Text>
      </Box>

      <ButtonInterface onClick={action} type={"button"}>
        Assign Group
      </ButtonInterface>
    </Flex>
  );
};

const IndexAssignGroupItem = () => {
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    groupname: Yup.string().required("Group name is required"),
  });

  const payload = {
    groupname: "",
  };
  const [loading, setLoading] = useState<boolean>(false);

  const defaultValue = {
    posService: {
      posChargesInPercentage: true,
      posCharges: 20,
      posChargesCappedAt: 300,
    },
    transferService: {
      transferFeeInPercentage: true,
      transferFeeCappedAt: 200,
      transferFee: 200,
    },
    fundwalletService: {
      fundWalletFee: 500,
      fundWalletFeeInPercentage: true,
      fundWalletFeeCappedAt: 200,
    },
    mobileTransfer: "01",
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
      createGroup(values);
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDelete,
    onOpen: onDelete,
    onClose: closeDelete,
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

  return (
    <DashboardLayout headerTop={topPart}>
      <Box bg={"white"}>
        <DefaultTable
          tableHeader={[
            "S/N",
            "Name",
            "Group Code",
            "Status",
            "Date",
            "Actions",
          ]}
        >
          {itemData?.map((items, index) => {
            return (
              <Fragment key={index}>
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>{items?.groupName}</Td>
                  <Td>{items?.groupCode}</Td>
                  <Td>{items?.posCharges}</Td>
                  <Td>{moment(items?.createdAt).format("MMM DD YYYY")}</Td>
                  <Td>
                    <Flex gap="1em">
                      <RiDeleteBinLine
                        onClick={onDelete}
                        size="1.3em"
                        cursor="pointer"
                      />
                      <HiOutlinePencilAlt />
                      <IoIosTimer cursor="pointer" size="1.3em" />
                    </Flex>
                  </Td>
                </Tr>

                <ModalLayout isOpen={isDelete} onClose={closeDelete}>
                  <Box py="1em" textAlign={"center"}>
                    <Text my="1em">Are you sure, you want to delete this?</Text>

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
            );
          })}
        </DefaultTable>
      </Box>

      <ModalLayout isOpen={isOpen} onClose={onClose}>
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

          <Box my={"1.5em"}>
            {/* <InputArea
              isError={formik.errors.email ? formik.errors.email : ""}
              isInvalid={formik.errors.email ? formik.errors.email : ""}
              type="number"
              name="nubam"
              placeholder="Enter number"
              label="Number"
              onChange={formik.handleChange}
            /> */}
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
export default IndexAssignGroupItem;

/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardLayout from "../../../../layout/dashboardLayout";
import { useFetch } from "../../../../utils/request";
import DefaultTable from "../../../../components/essentials/defaultTable";
import {
  Badge,
  Box,
  Flex,
  Text,
  Td,
  Tr,
  filter,
  useDisclosure,
} from "@chakra-ui/react";
import NoData from "../../../../components/essentials/noData";
import moment from "moment";
import { FaEye, FaMailBulk } from "react-icons/fa";
import DrawerLayout from "../../../../layout/draweerLayout";
import { AiOutlineHistory } from "react-icons/ai";
import Pagination from "../../../../components/atoms/pagination";
import useExportPDF from "../../../../hooks/useExportToPDF";
import useSearchFilter from "../../../../hooks/useSearch";

const FeedBack = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nextPrev, setNextPrev] = useState(1);
  const nextPage = () => setNextPrev(2);
  const prevPage = () => setNextPrev(1);

  const { data } = useFetch({
    endpoint: "admin/complain/feedback/get",
    body: {
      _populate: "user",
      _page: nextPrev,
      _pagelimit: 5,
    },
    nextPrev: nextPrev,
  });
  const [itemData, setItemData] = useState([]);
  const [comment, updateComment] = useState();

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  const header = [
    "S/N",
    "Customer Name",
    "Phone No.",
    "Email",
    "Title",
    "Resolved",
    "Time",
    "Date",
    "View",
    "Title",
  ];

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData(["phoneNumber", "titleTruncate"]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const exportPDF = useExportPDF();

  const exportDataToPdf = () => {
    exportPDF(data, header, "feedbak.pdf");
  };

  return (
    <DashboardLayout
      tableId="feedbacksTable"
      headerTop={"Feedbacks"}
      onSearch={handleSearchChange}
      exportToPDF={exportDataToPdf}
    >
      {filteredData.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="feedbacksTable">
          {filteredData?.map(
            ({ _id, resolved, tittle, user, createdAt }, index, item) => {
              const filterData = item?.filter(e => (e._id === _id ? e : ""));
              const titleTruncate = tittle.split(" ").splice(0, 5).join(" ");
              return (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{user?.customerName}</Td>
                  <Td>{user?.phone}</Td>
                  <Td>{user?.email}</Td>
                  <Td>{`${titleTruncate}...`}</Td>
                  <Td>
                    {resolved ? (
                      <Badge
                        colorScheme="whatsapp"
                        py={".3em"}
                        px={"1em"}
                        borderRadius={"1em"}
                      >
                        Resolved
                      </Badge>
                    ) : (
                      <Badge
                        colorScheme="red"
                        py={".3em"}
                        px={"1em"}
                        borderRadius={"1em"}
                      >
                        Un Resolved
                      </Badge>
                    )}
                  </Td>
                  <Td>{moment(createdAt).format("LTS")}</Td>
                  <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                  <Td
                    cursor={"pointer"}
                    onClick={() => {
                      onOpen();
                      updateComment(filterData[0]);
                    }}
                  >
                    <FaEye />
                  </Td>
                </Tr>
              );
            }
          )}
        </DefaultTable>
      )}

      <DrawerLayout size="xl" isOpen={isOpen} onClose={onClose}>
        <Box px={["100%", "4em"]}>
          <Flex justifyContent={"space-between"}>
            <Text fontWeight={"600"} fontSize={["17px", "18px"]}>
              Preview
            </Text>
            <Box
              display={"flex"}
              gap={".5em"}
              fontWeight={"bold"}
              alignItems={"center"}
            >
              <AiOutlineHistory />
              <Text>{moment(comment?.createdAt).format("YYYY-MM-DD")}</Text>
            </Box>
          </Flex>

          <Box my={"3em"}>
            <Box
              bg={"black"}
              px={"2em"}
              fontWeight={"bold"}
              fontSize={["19px", "18px"]}
              color={"#fff"}
              py={"1.5em"}
            >
              {comment?.tittle}
            </Box>
            <Box bg={"gray.100"} p={"2em"}>
              {comment?.comment}
            </Box>
          </Box>
        </Box>
      </DrawerLayout>
      <Pagination
        disabledPrev={nextPrev === 1 ? true : false}
        nextPage={nextPage}
        prev={prevPage}
      />
    </DashboardLayout>
  );
};

export default FeedBack;

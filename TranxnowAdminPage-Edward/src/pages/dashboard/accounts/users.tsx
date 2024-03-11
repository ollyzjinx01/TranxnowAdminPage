// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import { Badge, Td, Tr } from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import moment from "moment";
import Pagination from "../../../components/atoms/pagination";
import useSearchFilter from "../../../hooks/useSearch";
import useExportPDF from "../../../hooks/useExportToPDF";

const AccountUsers = () => {
  const [nextPrev, setNextPrev] = useState(1);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { data } = useFetch({
    endpoint: "admin/account/user/get",
    body: {
      _page: nextPrev,
      _pagelimit: 10,
    },
    nextPrev: nextPrev,
  });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data, nextPrev]);

  const header = [
    "S/N",
    "Ref Code",
    "Customer Name",
    "Email",
    "Phone No.",
    "Status",
    "Date",
  ];

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

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData([
    "email",
    "customerName",
    "phone",
    "refCode",
    "is_blocked",
  ]);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const exportPDF = useExportPDF();

  const exportDataToPdf = () => {
    exportPDF(data, header, "post_transaction.pdf");
  };
  return (
    <DashboardLayout
      tableId="accountUsersTable"
      headerTop={"Account Users"}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      onSearch={handleSearchChange}
      exportToPDF={exportDataToPdf}
    >
      {filteredData?.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="accountUsersTable">
          {filteredData?.map(
            (
              { customerName, email, phone, createdAt, refCode, is_blocked },
              index
            ) => {
              return (
                <Tr key={index}>
                  <Td>{index + countIndex}</Td>
                  <Td>{refCode}</Td>
                  <Td>{customerName}</Td>
                  <Td>{email}</Td>
                  <Td>{phone}</Td>
                  <Td>
                    {is_blocked ? (
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

                  <Td cursor={"pointer"}>
                    {moment(createdAt).format("YYYY-MM-DD")}
                  </Td>
                </Tr>
              );
            }
          )}
        </DefaultTable>
      )}
      <Pagination
        disabledPrev={nextPrev === 1 ? true : false}
        nextPage={nextPage}
        prev={prevPage}
      />
    </DashboardLayout>
  );
};

export default AccountUsers;

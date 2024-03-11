/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardLayout from "../../../../layout/dashboardLayout";
import { useFetch } from "../../../../utils/request";
import DefaultTable from "../../../../components/essentials/defaultTable";
import { Badge, Td, Tr } from "@chakra-ui/react";
import NoData from "../../../../components/essentials/noData";
import moment from "moment";
import { FiMoreVertical } from "react-icons/fi";
import useSearchFilter from "../../../../hooks/useSearch";
import useExportPDF from "../../../../hooks/useExportToPDF";

const DispenseError = () => {
  const { data } = useFetch({
    endpoint: "admin/complain/dispenseerror/get",
    // body: {
    //   _populate: "user",
    // },
  });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  const header = [
    "Name",
    "Account Name",
    "Credited Bank",
    "Credited Account",
    "Amount",
    "Verification",
    "Date",
    "More",
  ];

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData([
    "amount",
    "user",
    "is_verified",
    "credictAccount",
    "creditAccountName",
    "creditedBank",
  ]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const exportPDF = useExportPDF();

  const exportDataToPdf = () => {
    exportPDF(data, header, "Dispense Error.pdf");
  };

  return (
    <DashboardLayout
      tableId="dispenseErrorTable"
      headerTop={"Dispense Error"}
      exportToPDF={exportDataToPdf}
      onSearch={handleSearchChange}
    >
      {filteredData?.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="dispenseErrorTable">
          {filteredData?.map(
            (
              {
                creditAccountName,
                CreditedBank,
                is_verified,
                creditAccount,
                amount,
                user,
                createdAt,
              },
              index
            ) => {
              return (
                <Tr key={index}>
                  <Td>{user?.customerName}</Td>
                  <Td>{creditAccountName}</Td>
                  <Td>{CreditedBank}</Td>
                  <Td>{creditAccount}</Td>
                  <Td>{amount}</Td>
                  <Td>
                    {is_verified ? (
                      <Badge
                        colorScheme="whatsapp"
                        py={".3em"}
                        px={"1em"}
                        borderRadius={"1em"}
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        colorScheme="red"
                        py={".3em"}
                        px={"1em"}
                        borderRadius={"1em"}
                      >
                        Unverified
                      </Badge>
                    )}
                  </Td>
                  <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                  <Td cursor={"pointer"}>
                    <FiMoreVertical />
                  </Td>
                </Tr>
              );
            }
          )}
        </DefaultTable>
      )}
    </DashboardLayout>
  );
};

export default DispenseError;

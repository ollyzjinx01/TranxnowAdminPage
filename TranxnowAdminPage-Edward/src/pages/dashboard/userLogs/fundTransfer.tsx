/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState, Suspense } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import { Badge, Td, Tr } from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import moment from "moment";
import { FiMoreVertical } from "react-icons/fi";
import { formatNumber } from "../../../utils/formatNumber";
import { StatusBadge } from "../../../components/atoms/status_badge";
import { NAIRA_SIGN } from "../../../redux/constant";
import Pagination from "../../../components/atoms/pagination";
import useSearchFilter from "../../../hooks/useSearch";
import useExportPDF from "../../../hooks/useExportToPDF";

const FundTransfer = () => {
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

  const { data } = useFetch({
    endpoint: "admin/Log/fundtransfer/get",
    body: {
      _populate: "user",
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
  }, [data]);

  const header = [
    "S/N",
    "Name",
    "Account Name",
    "Credited Bank",
    "Credited Account",
    "Amount",
    // "Verification",
    "Status",
    "Date",
    "Time",
    "More",
  ];

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData([
    "Amount",
    "Name",
    "amount",
    "Status",
    "CreditedBank",
    "creditAccount",
    "customerName",
    "creditAccountName",
  ]);

  const searchForData = event => {
    setSearchTerm(event.target.value);
  };

  const exportPDF = useExportPDF();

  const exportDataToPdf = () => {
    exportPDF(data, header, "Fund-Transfer.pdf");
  };

  return (
    <DashboardLayout
      tableId="transferTable"
      headerTop={"Fund Transfer History"}
      exportToPDF={exportDataToPdf}
      onSearch={searchForData}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {filteredData?.length === 0 ? (
          <NoData />
        ) : (
          <DefaultTable tableHeader={header} tableId="transferTable">
            {filteredData?.map(
              (
                {
                  creditAccountName,
                  CreditedBank,
                  creditAccount,
                  amount,
                  user,
                  createdAt,
                  status,
                },
                index
              ) => {
                const customerName = user?.customerName;
                return (
                  <Tr key={index}>
                    <Td>{index + countIndex}</Td>
                    <Td>{customerName}</Td>
                    <Td>{creditAccountName}</Td>
                    <Td>{CreditedBank}</Td>
                    <Td>{creditAccount}</Td>
                    <Td>
                      {NAIRA_SIGN} {formatNumber(amount)}
                    </Td>
                    {/* <Td>
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
                    </Td> */}
                    <Td>
                      <StatusBadge status_code={status} />
                    </Td>
                    <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                    <Td>{moment(createdAt).format("LTS")}</Td>
                    <Td cursor={"pointer"}>
                      <FiMoreVertical />
                    </Td>
                  </Tr>
                );
              }
            )}
          </DefaultTable>
        )}
      </Suspense>

      <Pagination
        disabledPrev={nextPrev === 1 ? true : false}
        nextPage={nextPage}
        prev={prevPage}
      />
    </DashboardLayout>
  );
};

export default FundTransfer;

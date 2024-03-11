/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import { Td, Tr } from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import moment from "moment";
import { formatNumber } from "../../../utils/formatNumber";
import { StatusBadge } from "../../../components/atoms/status_badge";
import Pagination from "../../../components/atoms/pagination";
import useSearchFilter from "../../../hooks/useSearch";
import useExportPDF from "../../../hooks/useExportToPDF";

const PosLogs = () => {
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
  const [itemData, setItemData] = useState([]);

  const { data } = useFetch({
    endpoint: "admin/Log/pos/get",
    body: {
      _populate: "agent",
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

  const header = [
    "INDEX",
    "SERAIL NUMBER",
    "Merchant ID",
    "Business Name",
    "Terminal ID",
    "City",
    "LGA",
    "Amount",
    "Provider",
    "Status",
    "Date",
    "Time",
  ];

  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const filteredData = filterData([
    "serviceProvider",
    "Amount",
    "TerminalID",
    "MerchantID",
    "agent",
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
      tableId="POSTable"
      headerTop={"POS"}
      exportToPDF={exportDataToPdf}
      onSearch={handleSearchChange}
    >
      {filteredData?.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="POSTable">
          {filteredData?.map(
            (
              {
                agent,

                MerchantId,
                TerminalID,
                serviceProvider,
                Amount,
                createdAt,
                StatusCode,
              },
              index
            ) => {
              return (
                <Tr key={index}>
                  <Td>{index + countIndex}</Td>
                  <Td>{agent.serialnumber}</Td>
                  <Td>{MerchantId}</Td>
                  <Td>{agent?.businessdata?.busnessName}</Td>
                  <Td>{TerminalID ? TerminalID : "No Terminal ID"}</Td>
                  <Td>{agent?.businessdata?.city}</Td>
                  <Td>{agent?.businessdata?.lga}</Td>
                  <Td>₦ {formatNumber(Amount)}</Td>
                  <Td>{serviceProvider}</Td>
                  <Td>
                    <StatusBadge status_code={StatusCode} />
                  </Td>
                  <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                  <Td>{moment(createdAt).format("LTS")}</Td>
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

export default PosLogs;

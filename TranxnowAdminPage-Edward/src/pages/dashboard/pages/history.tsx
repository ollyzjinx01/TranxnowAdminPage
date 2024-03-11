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
import { NAIRA_SIGN } from "../../../redux/constant";
import Pagination from "../../../components/atoms/pagination";
import { TransactionType } from "../../../components/atoms/dashboard/micros";
import useSearchFilter from "../../../hooks/useSearch";
import jsPDF from "jspdf";
import "jspdf-autotable";

const LogHistories = () => {
  console.log("LLLLLLLLLLLLLLLLLLLll");
  const doc = new jsPDF();
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
    endpoint: "admin/Log/history/get",
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
    "User",
    "Phone No.",
    "Service",
    " Type",
    "Amount",
    "Date",
    "Time",
  ];
  const { setSearchTerm, filterData } = useSearchFilter(data || []);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredData = filterData(["customerName", "phone", "service"]);

  const exportPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "S/N",
      "User",
      "Phone No.",
      "Service",
      "Type",
      "Amount",
      "Date",
      "Time",
    ];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const itemData = [
        index + countIndex,
        item.user?.customerName,
        item.user?.phone,
        item.service,
        item.transactionType, // You might need to format this
        `${NAIRA_SIGN} ${formatNumber(item.amount)}`,
        moment(item.createdAt).format("YYYY-MM-DD"),
        moment(item.createdAt).format("LT"),
      ];
      tableRows.push(itemData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Transaction History", 14, 15);
    doc.save("transaction_history.pdf");
  };

  return (
    <DashboardLayout
      tableId="historyTable"
      headerTop={"History"}
      // exportToPDF={(onClick = { exportPDF })}
      onSearch={handleSearchChange}
    >
      {filteredData?.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="historyTable">
          {filteredData?.map(
            (
              {
                user,
                phoneNumber,
                service,
                transactionType,
                amount,
                createdAt,
              },
              index
            ) => {
              return (
                <Tr key={index}>
                  <Td>{index + countIndex}</Td>
                  <Td>{user?.customerName}</Td>
                  <Td>{user?.phone}</Td>
                  <Td>{service}</Td>
                  <Td>
                    <center>
                      <TransactionType type={transactionType} />
                    </center>
                  </Td>
                  <Td>
                    {NAIRA_SIGN} {formatNumber(amount)}
                  </Td>

                  <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                  <Td>{moment(createdAt).format("LT")}</Td>
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
      )}
    </DashboardLayout>
  );
};

export default LogHistories;

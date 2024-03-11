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
import Pagination from "../../../components/atoms/pagination";

const LogWallet = () => {
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
    endpoint: "admin/Log/wallet/get",
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
    "Customer Name",
    "Account Number",
    "Amount",
    "Bank",
    "Date",
    "Time",
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const searchForData = searchValue => {
    setSearchTerm(String(searchValue));
  };

  const filteredData = itemData.filter(({ user, accountNumber, bank }) => {
    const customerName = user?.customerName || "";
    const accNumber = accountNumber || "";
    const bankName = bank || "";

    return (
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bankName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <DashboardLayout
      tableId="walletTable"
      headerTop={"Wallet"}
      onSearch={e => {
        searchForData(e.target.value);
      }}
    >
      {filteredData.length === 0 ? (
        <NoData />
      ) : (
        <>
          <DefaultTable tableHeader={header} tableId="walletTable">
            {filteredData.map(
              ({ user, accountNumber, amount, bank, createdAt }, index) => {
                return (
                  <Tr key={index}>
                    <Td>{index + countIndex}</Td>
                    <Td>{user?.customerName}</Td>
                    <Td>{accountNumber}</Td>
                    <Td>₦ {formatNumber(amount)}</Td>
                    <Td>{bank}</Td>
                    <Td>{moment(createdAt).format("YYYY-MMMM-DD")}</Td>
                    <Td>{moment(createdAt).format("LT")}</Td>
                  </Tr>
                );
              }
            )}
          </DefaultTable>
          <Pagination
            disabledPrev={nextPrev === 1 ? true : false}
            nextPage={nextPage}
            prev={prevPage}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default LogWallet;

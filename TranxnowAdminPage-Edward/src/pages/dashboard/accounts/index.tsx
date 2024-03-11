// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import { Td, Tr } from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import { formatNumber } from "../../../utils/formatNumber";
import { NAIRA_SIGN } from "../../../redux/constant";
import moment from "moment";
import Pagination from "../../../components/atoms/pagination";

const AccountNumbers = () => {
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
    endpoint: "admin/account/getnubam",
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
    "Marchant ID",
    "Account Name",
    "Email",
    "Phone No.",
    "Min Amount",
    "Max Amount",
    "Bank Name",
    "Bank Code",
    "Date",
    "Time",
  ];

  console.log(itemData);
  return (
    <DashboardLayout headerTop={"Account"} tableId="accountsTable">
      {itemData.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="accountsTable">
          {itemData.map((items, index) => {
            const user = items?.user;
            return (
              <Tr key={index}>
                <Td>{index + countIndex}</Td>
                <Td>{items?.merchantId}</Td>
                <Td>{user?.customerName}</Td>
                <Td>{user?.email}</Td>
                <Td>{user?.phone}</Td>
                <Td>
                  {NAIRA_SIGN}
                  {formatNumber(items?.min_amount)}
                </Td>
                <Td>
                  {NAIRA_SIGN}
                  {formatNumber(items?.max_amount)}
                </Td>
                <Td>{items?.bank_name}</Td>
                <Td>{items?.bank_code}</Td>
                <Td>{moment(items?.createdAt).format("YYYY - MM - DD")}</Td>
                <Td>{moment(items?.createdAt).format("LTS")}</Td>
              </Tr>
            );
          })}
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

export default AccountNumbers;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import { Td, Tr } from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
import { FiMoreVertical } from "react-icons/fi";
import moment from "moment";
import { formatNumber } from "../../../utils/formatNumber";
import { StatusBadge } from "../../../components/atoms/status_badge";
import { NAIRA_SIGN } from "../../../redux/constant";
import Pagination from "../../../components/atoms/pagination";

const ElectricityLog = () => {
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
    endpoint: "admin/Log/getelectric",
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
    "Phone No.",
    "Amount No.",
    "Service",
    "Amount",
    "Ref Code",
    "Token Code",
    "Status",
    "Date",
    "Time",
  ];
  return (
    <DashboardLayout
      headerTop={"Electricity History"}
      tableId="electricityTable"
    >
      {itemData.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="electricityTable">
          {itemData.map((items, index) => {
            return (
              <Tr key={index}>
                {/* <Td>{items?.is_verified ? "Verified" : "Not Verified"}</Td>*/}

                <Td>{index + countIndex}</Td>
                <Td>{items?.user?.customerName}</Td>
                <Td>{items?.user?.phone}</Td>
                <Td>{items?.account_number}</Td>
                <Td>{items?.serviceType}</Td>
                <Td>
                  {NAIRA_SIGN} {formatNumber(items?.amount)}
                </Td>
                <Td>{items?.user?.refCode}</Td>
                <Td>{items?.tokenCode || "Pending"}</Td>
                <Td>
                  <StatusBadge status_code={items?.status} />
                </Td>
                <Td>{moment(items?.createdAt).format("MMM-DD-YY")}</Td>
                <Td>{moment(items?.createdAt).format("LTS")}</Td>
              </Tr>
            );
          })}
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

export default ElectricityLog;

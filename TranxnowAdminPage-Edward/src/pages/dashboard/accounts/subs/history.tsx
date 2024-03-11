// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Text, Badge, Box, Td, Tr } from "@chakra-ui/react";
import DefaultTable from "../../../../components/essentials/defaultTable";
import { useEffect, useState } from "react";
import { useFetch } from "../../../../utils/request";
import NoData from "../../../../components/essentials/noData";
import { formatNumber } from "../../../../utils/formatNumber";
import { StatusBadge } from "../../../../components/atoms/status_badge";
import moment from "moment";
import { NAIRA_SIGN } from "../../../../redux/constant";
import { TransactionType } from "../../../../components/atoms/dashboard/micros";
import Pagination from "../../../../components/atoms/pagination";

const AgentHistories = ({ _id }: { _id: string }) => {
  const [itemData, setItemData] = useState([]);
  const [nextPrev, setNextPrev] = useState(1);
  const [countIndex, setCountIndex] = useState(1);

  const addon = 10;

  const nextPage = () => {
    setNextPrev(nextPrev + 1);
    setCountIndex(countIndex + addon);
  };
  const prevPage = () => {
    setNextPrev(nextPrev - 1);
    setCountIndex(countIndex - addon);
  };

  const header = [
    "S/N",
    "Service",
    "Amount",
    "Naration",
    "Type",
    "Status",
    "Date",
    "Time",
  ];

  const { data } = useFetch({
    // endpoint: "admin/account/agent/get",
    endpoint: "admin/Log/history/get",
    body: {
      user: _id,
      _page: nextPrev,
      _pagelimit: 8,
    },
    nextPrev: nextPrev,
  });

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  return (
    <>
      <Text fontSize={"1.6em"} fontWeight={"600"}>
        All Transactions
      </Text>

      <Box my={"em"}>
        {itemData?.length === 0 ? (
          <NoData />
        ) : (
          <DefaultTable tableHeader={header}>
            {itemData?.map((items, index) => {
              return (
                <Tr key={index}>
                  <Td>{index + countIndex}</Td>
                  <Td>{items?.service}</Td>
                  <Td>
                    {" "}
                    {NAIRA_SIGN} {formatNumber(items?.amount)}
                  </Td>
                  <Td>{items?.narration}</Td>
                  <Td>
                    <TransactionType type={items?.transactionType} />
                  </Td>
                  <Td>
                    <StatusBadge status_code={items?.status} />
                  </Td>
                  <Td>{moment(items?.createdAt).format("YYYY-MM-DD")}</Td>
                  <Td>{moment(items?.createdAt).format("LT")}</Td>
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
      </Box>
    </>
  );
};

export default AgentHistories;

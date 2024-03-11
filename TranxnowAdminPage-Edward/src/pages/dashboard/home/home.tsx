/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Box, Flex, Select, Text, Tr, Td } from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { useFetch } from "../../../utils/request";
import HomeTransactionalTable from "./components/homeTransactionalTable";
import { useSelector } from "react-redux";
import { NAIRA_SIGN } from "../../../redux/constant";
import ContentDataBox from "../../../components/atoms/contentDataBox";
import DefaultTable from "../../../components/essentials/defaultTable";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatNumber } from "../../../utils/formatNumber";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [data, setData] = useState([]);

  // const { data: responseData } = useFetch({
  //   endpoint: "admin/Log/fundwallet/get",
  // });

  const { data: responseData } = useFetch({
    endpoint: "admin/Log/dashboard",
  });

  useEffect(() => {
    setData(responseData);
  }, [responseData]);

  if (!responseData) {
    return;
  }

  console.log(responseData);

  const {
    totslAgents,
    fedbacks,
    posRevers,
    adminUser,
    appusers,
    agentManager,
    usersWalletSum,
    dispenseError,
    applicationTotalTransaction,
    usersRegistrationStatus,
  } = responseData;

  const logData = [
    {
      "Total Agents": totslAgents,
      "Admin User": adminUser,
      "Application Users": appusers,
      "Agent Manager": agentManager,
      "Pos Reverse": posRevers,
      Feedbacks: fedbacks,
      "Dispense Error": dispenseError,
      "Wallet Value": usersWalletSum.toFixed(2),
      "Application Transaction": applicationTotalTransaction.toFixed(2),
    },
  ];

  const { bvn, wallet, registration, emailVerification } =
    usersRegistrationStatus;

  const {
    reprocessTransactions,
    fruadTransactions,
    successfulTransactions,
    users,
    revenue,
  } = responseData;

  const datas = [
    {
      "Reprocessed Transactions": reprocessTransactions,
      "Fruad Transactions": fruadTransactions,
      "Success Transactions": successfulTransactions,
      Users: users,
      Revenue: revenue,
    },
  ];

  const tableHeader = ["Name", "Daily", "Weekly", "Monthly"];

  const chart = {
    labels: ["Bvn", "Wallet", "Registration", "Email verification"],
    datasets: [
      {
        data: [emailVerification, wallet, registration, bvn],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#42ba42"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#42ba42"],
      },
    ],
  };

  return (
    <DashboardLayout
      headerTop={"Dashboard"}
      background="none"
      hideTopItem={true}
    >
      {/* <HomeTransactionalTable /> */}
      <Flex gap={"1em"} flexWrap={"wrap"}>
        {logData?.map((item, index) => {
          return Object.entries(item).map(([title, number]) => (
            <Fragment key={index}>
              <ContentDataBox
                title={title}
                number={
                  title === "Application Transaction"
                    ? `${NAIRA_SIGN} ${formatNumber(number)} `
                    : formatNumber(number)
                }
              />
            </Fragment>
          ));
        })}
      </Flex>

      <Text mt={"2em"} mb={"1em"} fontWeight={600} fontSize={"1.5em"}>
        Application Health
      </Text>

      <Box
        my={"1.5em"}
        bg={"white"}
        textAlign={"center"}
        h={"350px"}
        py={"1em"}
        w={["100%", "100%", "500px"]}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box>
          <Doughnut data={chart} />
        </Box>
      </Box>

      <Box>
        <Text mt={"2em"} mb={"1em"} fontWeight={600} fontSize={"1.5em"}>
          Analysis
        </Text>

        <DefaultTable tableHeader={tableHeader}>
          {datas?.map((item, index) => {
            return Object.entries(item).map(([title, number]) => (
              <Tr key={index}>
                <Td>{title}</Td>
                <Td>{number.day}</Td>
                <Td>{number.week}</Td>
                <Td>{number?.month}</Td>
              </Tr>
            ));
          })}
        </DefaultTable>
      </Box>
    </DashboardLayout>
  );
};
export default Home;

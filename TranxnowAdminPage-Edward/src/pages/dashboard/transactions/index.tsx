import { Box, Text, Flex } from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import ButtonInterface from "../../../components/essentials/button";
import NoData from "../../../components/essentials/noData";

const TransactionsTop = () => {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Box>
        <Text>Transactions</Text>
      </Box>

      <ButtonInterface type={"button"}>Go Back</ButtonInterface>
    </Flex>
  );
};
const Transaction = () => {
  return (
    <DashboardLayout
      headerTop={<TransactionsTop />}
      tableId={"transactionsTable"}
    >
      <Box bg={"white"} py={"2em"} px={"1em"}>
        <NoData />
      </Box>
    </DashboardLayout>
  );
};
export default Transaction;

import { Box, Flex, Text } from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import NoData from "../../../components/essentials/noData";
import ButtonInterface from "../../../components/essentials/button";
const ReportTop = () => {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Box>
        <Text fontWeight={"bold"} fontSize={"1.5em"}>
          Users
        </Text>
      </Box>

      <ButtonInterface type={"button"}>New Report</ButtonInterface>
    </Flex>
  );
};
const Report = () => {
  return (
    <DashboardLayout headerTop={<ReportTop />} tableId={"reportTable"}>
      <Box bg={"white"} py={"2em"} px={"1em"}>
        <NoData />
      </Box>
    </DashboardLayout>
  );
};
export default Report;

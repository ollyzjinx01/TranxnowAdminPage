import { Box } from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";
import NoData from "../../../components/essentials/noData";

const Statement = () => {
  return (
    <DashboardLayout headerTop={""} tableId={"statementTable"}>
      <Box bg={"white"} py={"2em"} px={"1em"}>
        <NoData />
      </Box>
    </DashboardLayout>
  );
};
export default Statement;

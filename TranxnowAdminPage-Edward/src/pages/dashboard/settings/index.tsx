import { Box } from "@chakra-ui/react";
import DashboardLayout from "../../../layout/dashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout tableId={"settingsTable"}>
      <Box bg={"white"} py={"2em"} px={"1em"}>
        Settings
      </Box>
    </DashboardLayout>
  );
};
export default Settings;

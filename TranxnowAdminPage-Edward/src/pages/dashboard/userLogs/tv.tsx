import { useEffect, useState } from "react";
import DashboardLayout from "../../../layout/dashboardLayout";
import { useFetch } from "../../../utils/request";
import DefaultTable from "../../../components/essentials/defaultTable";
import { Td, Tr } from "@chakra-ui/react";
import NoData from "../../../components/essentials/noData";
const TvLog = () => {
  const { data } = useFetch({ endpoint: "admin/Log/gettv" });
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  const header = ["User", "Network", "Phone Number", "Amount", "Plan"];
  return (
    <DashboardLayout headerTop={"TV"} tableId="tvTable">
      {itemData.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="tvTable">
          {itemData.map(
            ({ user, phoneNumber, network, plan, amount }, index) => {
              return (
                <Tr key={index}>
                  <Td>{user}</Td>
                  <Td>{network}</Td>
                  <Td>{phoneNumber}</Td>
                  <Td>{amount}</Td>
                  <Td>{plan}</Td>
                </Tr>
              );
            }
          )}
        </DefaultTable>
      )}
    </DashboardLayout>
  );
};

export default TvLog;

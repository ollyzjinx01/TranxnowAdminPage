/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect, useState } from "react";

import { useFetch } from "../../../../utils/request";
import DefaultTable from "../../../../components/essentials/defaultTable";
import { Td, Tr, Avatar } from "@chakra-ui/react";
import NoData from "../../../../components/essentials/noData";
import moment from "moment";
import { FiMoreVertical } from "react-icons/fi";
import { formatNumber } from "../../../../utils/formatNumber";
import { postData } from "../../../../utils/request";
import Pagination from "../../../../components/atoms/pagination";
import { StatusBadge } from "../../../../components/atoms/status_badge";
import DashboardLayout from "../../../../layout/dashboardLayout";
import useSearchFilter from "../../../../hooks/useSearch";
import useExportPDF from "../../../../hooks/useExportToPDF";
import useExportCSV from "../../../../hooks/useExportToCsv";

const AirtimeData = ({ sliceData }: { onSearch?: () => void }) => {
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

  const { data } = useFetch({
    endpoint: "admin/Log/getAirtime",
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
    "Name",
    "Customer Email",
    "Customer NO.",
    "Phone No.",
    "Amount",
    "Network",
    "Status",
    "Time",
    "Date",
    "More",
  ];

  const [isLoading, setLoading] = useState<boolean>(false);

  const reproccessAirtime = async _id => {
    setLoading(true);

    try {
      const { response, decryted } = await postData({
        url: "admin/Log/updateAirtime",
        body: {
          status: "00",
          airtime_id: _id,
        },
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      toast.success("Proccessing", {});
      window.location.reload();
      onClose();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const { setSearchTerm, filterData } = useSearchFilter(data || []);
  const filterdData = filterData([
    "data?.biodata?.firstname",
    "user",
    "email",
    "status",
    "network",
    "phoneNumber",
    filterData?.user?.biodata?.firstname,
    filterData?.user?.email,
  ]);

  const searchForData = event => setSearchTerm(event?.target.value);

  const exportPDF = useExportPDF();
  const exportDataToCsv = useExportCSV();

  const exportDataToPdf = () => {
    exportPDF(data, header, "Airtime_transaction.pdf");
  };

  const exportCsv = () => {
    exportDataToCsv(data, header, "Airtime_transaction.csv");
  };

  return (
    <DashboardLayout
      tableId="airtimeTable"
      headerTop="Airtime"
      onSearch={searchForData}
      exportToPDF={exportDataToPdf}
    >
      <p onClick={exportCsv}>Export to PDF</p>
      {filterdData?.length === 0 ? (
        <NoData />
      ) : (
        <DefaultTable tableHeader={header} tableId="airtimeTable">
          {sliceData
            ? filterdData.splice(0, 5)
            : filterdData?.map(
                (
                  {
                    user,
                    phoneNumber,
                    network,
                    status,
                    amount,
                    email,
                    createdAt,
                    _id,
                  },
                  index
                ) => {
                  const formattedNumber = formatNumber(amount);

                  let networkName;

                  if (network === "mtn") {
                    networkName = (
                      <Avatar
                        src={
                          "data:image/png;base64,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"
                        }
                      />
                    );
                  } else if (network === "glo") {
                    networkName = (
                      <Avatar
                        src={
                          "data:image/jpeg;base64,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"
                        }
                      />
                    );
                  } else if (network === "airtel") {
                    networkName = (
                      <Avatar
                        src={
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHgGUDufXMNgVA-U9aNI7JUYcxtpLl6SMYgeAiM5BW1R_F05-69NHrOAgKLnMBVmhx_Cs"
                        }
                      />
                    );
                  }

                  return (
                    <Tr key={index}>
                      <Td>{index + countIndex}</Td>
                      <Td>
                        {user?.biodata?.firstname} {user?.biodata?.surname}{" "}
                      </Td>
                      <Td>{user?.email}</Td>
                      <Td>{user?.phone}</Td>
                      <Td>{phoneNumber}</Td>
                      <Td>₦ {formatNumber(formattedNumber)}</Td>
                      <Td>{networkName}</Td>
                      <Td>
                        {" "}
                        <StatusBadge status_code={status} />
                      </Td>
                      <Td>{moment(createdAt).format("LT")}</Td>
                      <Td>{moment(createdAt).format("YYYY-MM-DD")}</Td>
                      <Td cursor={"pointer"}>
                        <FiMoreVertical />
                      </Td>
                    </Tr>
                  );
                }
              )}
          <Pagination
            nextPage={nextPage}
            prev={prevPage}
            disabledPrev={nextPrev === 1 ? true : false}
          />
        </DefaultTable>
      )}
    </DashboardLayout>
  );
};

export default AirtimeData;

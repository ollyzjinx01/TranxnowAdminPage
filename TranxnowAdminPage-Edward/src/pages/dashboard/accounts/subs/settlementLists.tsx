// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { FC } from "react";
import ButtonInterface from "../../../../components/essentials/button";
import NoData from "../../../../components/essentials/noData";
import { Text, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useFetch } from "../../../../utils/request";
import { RiDeleteBin5Line } from "react-icons/ri";
import { StatusBadge } from "../../../../components/atoms/status_badge";
import { postData } from "../../../../utils/request";
import { toast } from "react-toastify";
interface ILittleSettlement {
  _id?: string;
  onClick: () => void;
}
const ListSettlement: FC<ILittleSettlement> = ({ _id, onClick }) => {
  const [itemData, setItemData] = useState([]);
  const { data } = useFetch({
    // endpoint: "admin/account/agent/get",
    endpoint: "admin/merchantsettlement/get",
    body: {
      agent: _id,
      isDeleted: false,
    },
  });

  useEffect(() => {
    if (data) {
      setItemData(data);
    }
  }, [data]);

  //delete user settlement
  const deleteSettlement = async () => {
    try {
      const { response, decryted } = await postData({
        url: "admin/merchantsettlement/delete",

        body: {
          settlementBankId: itemData[0]?._id,
        },
        header: {
          Authorization: `Bearer ${localStorage.getItem("_authToken")}`,
        },
      });

      toast.success("Bank detail deleted");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      return;
    }
  };

  return (
    <>
      <Text fontWeight={"bold"} my={"1.5em"}>
        Settlement List
      </Text>

      {itemData?.length === 0 ? (
        <NoData />
      ) : (
        <Box
          display={"flex"}
          bg={"#fdbc1329"}
          p={"1em"}
          borderRadius={"10px"}
          justifyContent={"space-between"}
        >
          <Box>
            <Text fontWeight={"600"}>{itemData[0]?.accountName}</Text>
            <Text my={"0.5em"}>{itemData[0]?.Numban}</Text>
            <StatusBadge status_code={itemData[0]?.status} />
          </Box>
          <Box>
            <RiDeleteBin5Line
              size={"1.2em"}
              cursor={"pointer"}
              color={"red"}
              onClick={deleteSettlement}
            />
          </Box>
        </Box>
      )}

      <Box
        px={"1em"}
        py={".2em"}
        position={"fixed"}
        bottom={"2"}
        left={0}
        right={0}
      >
        <ButtonInterface type={"button"} width={"100%"} onClick={onClick}>
          Add Settlement
        </ButtonInterface>
      </Box>
    </>
  );
};

export default ListSettlement;

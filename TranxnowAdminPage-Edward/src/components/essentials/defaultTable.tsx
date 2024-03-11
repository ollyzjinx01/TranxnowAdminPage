/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { FC, ReactNode } from "react";

type TDefault = {
  tableHeader?: Array<string>;
  children?: ReactNode;
  tableName?: string;
  tableId: string;
};

const DefaultTable: FC<TDefault> = ({
  tableHeader,
  children,
  tableName,
  tableId,
}) => {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="gray" id={tableId}>
        <TableCaption>{tableName}</TableCaption>
        <Thead bg={"#000"} color={"#fff"}>
          <Tr color={"#fff"}>
            {tableHeader?.map((item, index) => {
              return (
                <Th key={index} color={"#fff"} py={"2em"}>
                  {item}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody bg={"white"}>{children}</Tbody>
      </Table>
    </TableContainer>
  );
};

export default DefaultTable;

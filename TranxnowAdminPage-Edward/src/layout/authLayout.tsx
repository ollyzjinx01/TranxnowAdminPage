/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactNode, FC } from "react";

type TAuth = {
  children: ReactNode;
  title: string;
};
const AuthLayout: FC<TAuth> = ({ children, title }) => {
  return (
    <Flex flexDir={["column", "column", "row"]}>
      <Box
        w={["100%", "100%", "60%"]}
        h={["30vh", "100vh"]}
        bgImage={
          "https://res.cloudinary.com/dhdqt4xwu/image/upload/v1687848091/tranxnow/photo_5823561399941578355_y_ia5quw.jpg"
        }
        bgPos={""}
        bgSize={"contain"}
      >
        <Box h={"100%"} bg={"#031a31f0"}></Box>
      </Box>
      <Box
        w={{
          sm: "100%",
          md: "100%",
          lg: "30%",
        }}
        mx={"auto"}
        py={"2em"}
        px={["1.5em", "2em"]}
      >
        <Box
          bg={"black"}
          w={"90px"}
          h={"90px"}
          mt={"2em"}
          bgSize={"cover"}
          bgRepeat={"no-repeat"}
          bgPos={"center"}
          bgImage={
            "https://res.cloudinary.com/dhdqt4xwu/image/upload/v1685956196/tranxnow/IMG-20230531-WA0006_mrv7df.jpg"
          }
        ></Box>
        {children}
      </Box>
    </Flex>
  );
};
export default AuthLayout;

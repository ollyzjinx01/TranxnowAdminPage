// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  Avatar,
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { FaBars } from "react-icons/fa";
import DrawerLayout from "../../layout/draweerLayout";
import { MenuContent } from "../essentials/menuContents";
import { RxCaretDown, RxExit } from "react-icons/rx";

const DashboardHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <Box bg={"gray.100"} px={"2em"} w={"100%"} py={"1em"}>
      <Flex justifyContent={"space-between"}>
        <form
          style={{
            visibility: "hidden",
          }}
        >
          <InputGroup>
            <Input bg={"#fff"} placeholder="Search" />
            <InputRightElement children={<BiSearch />} />
          </InputGroup>
        </form>

        <Avatar />

        {/* <Box display={"flex"} alignItems={"center"} gap={"1em"}>
          <Menu>
            <MenuButton as={Button} rightIcon={<RxCaretDown />}>
              <Flex alignItems={"center"} gap={"1em"}>
                <Avatar /> Admin
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem gap={".5em"} onClick={logOut}>
                <RxExit />
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
          <Box display={["block", "none", "none"]}>
            <FaBars
              color={"#fff"}
              size={"1.6em"}
              onClick={onOpen}
              cursor={"pointer"}
            />
          </Box>
        </Box> */}
      </Flex>

      <DrawerLayout
        size={"full"}
        placement={"left"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <MenuContent />
      </DrawerLayout>
    </Box>
  );
};
export default DashboardHeader;

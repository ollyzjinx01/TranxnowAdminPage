/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import { SidebarItems } from "../../utils/sidebarItems";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export const MenuContent = () => {
  const getPath = window.location.pathname;
  const activeState = {
    bg: "#8080801c",
    padding: " 1em 2em ",
    borderRadius: "8px",
    cursor: "pointer",
  };
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = index => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  return (
    <>
      {SidebarItems.map(({ name, icon, path, menu }, index) => {
        const isMenuOpen = activeMenu === index;
        return (
          <Box key={index} position="relative">
            <Link to={path}>
              <Box
                gap={"1em"}
                display={"flex"}
                alignItems={"center"}
                my={"1em"}
                sx={getPath === path ? activeState : "none"}
                _hover={{
                  bg: "#8080801c",
                  padding: " 1em 2em ",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                px={"2em"}
                onClick={() => handleMenuClick(index)}
              >
                {icon}
                <Text fontSize={"18px"}>{name}</Text>
                {menu && (
                  <FiChevronDown
                    size={"1.2em"}
                    style={{
                      marginLeft: "auto",
                      background: "white !important",
                      transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                )}
              </Box>
            </Link>
            {menu && isMenuOpen && (
              <Box
                position="absolute"
                top="100%"
                left="100%"
                mt="-1px"
                ml="-1px"
                bg="primary.100"
                borderRadius="8px"
                p="1em"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
              >
                {menu.map((item, itemIndex) => (
                  <Link key={itemIndex} to={item.path}>
                    <Box
                      display="flex"
                      alignItems="center"
                      my="0.5em"
                      lineHeight={"2.5em"}
                      w={"15em"}
                      _hover={{
                        color: "primary.500",
                      }}
                    >
                      <Text fontSize="16px">{item.title}</Text>
                    </Box>
                  </Link>
                ))}
              </Box>
            )}
          </Box>
        );
      })}
    </>
  );
};

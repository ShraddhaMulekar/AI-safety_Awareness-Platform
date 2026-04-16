import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { HiShieldCheck } from "react-icons/hi";

const links = [
  { label: "Home", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
  { label: "Scam Analyzer", to: "/scam" },
  { label: "Bill Analyzer", to: "/bill" },
];

const pulse = keyframes`
  0% { transform: translateY(0px) scale(1); opacity: 0.55; }
  50% { transform: translateY(-10px) scale(1.08); opacity: 0.85; }
  100% { transform: translateY(0px) scale(1); opacity: 0.55; }
`;

const AppShell = ({ children }) => {
  const location = useLocation();
  const compact = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh" bgGradient="radial(circle at top, #1a2d65 0%, #070b1a 40%, #04070f 100%)">
      <Box
        position="fixed"
        top="120px"
        right="-60px"
        w="220px"
        h="220px"
        borderRadius="full"
        bg="cyan.400"
        filter="blur(120px)"
        opacity={0.45}
        animation={`${pulse} 6s ease-in-out infinite`}
        pointerEvents="none"
      />
      <Box
        position="fixed"
        bottom="60px"
        left="-80px"
        w="260px"
        h="260px"
        borderRadius="full"
        bg="purple.500"
        filter="blur(140px)"
        opacity={0.4}
        animation={`${pulse} 8s ease-in-out infinite`}
        pointerEvents="none"
      />
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        backdropFilter="blur(12px)"
        bg="rgba(7, 11, 26, 0.72)"
        borderBottom="1px solid"
        borderColor="whiteAlpha.300"
      >
        <Container maxW="7xl" py={3}>
          <Flex align="center" justify="space-between" gap={4} wrap="wrap">
            <HStack spacing={3}>
              <Icon as={HiShieldCheck} boxSize={7} color="cyan.300" />
              <Text fontWeight="700" letterSpacing="wide">
                AI Safety Awareness
              </Text>
            </HStack>
            <HStack spacing={2} flexWrap="wrap" justify={compact ? "center" : "end"}>
              {links.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Button
                    as={RouterLink}
                    key={link.to}
                    to={link.to}
                    size="sm"
                    borderRadius="full"
                    variant={isActive ? "solid" : "ghost"}
                    colorScheme={isActive ? "cyan" : "whiteAlpha"}
                    _hover={{ transform: "translateY(-1px)" }}
                    transition="all 0.2s ease"
                  >
                    {link.label}
                  </Button>
                );
              })}
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="7xl" pt={{ base: "9.5rem", md: "6.5rem" }} pb={10}>
        {children}
      </Container>
    </Box>
  );
};

export default AppShell;

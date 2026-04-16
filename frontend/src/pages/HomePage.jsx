import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { HiArrowRight, HiDocumentReport, HiShieldCheck, HiSparkles } from "react-icons/hi";

const cardStyle = {
  bg: "whiteAlpha.100",
  border: "1px solid",
  borderColor: "whiteAlpha.300",
  borderRadius: "2xl",
  p: 6,
  backdropFilter: "blur(10px)",
  transition: "all 0.25s ease",
  _hover: { transform: "translateY(-4px)", borderColor: "cyan.300" },
};

const HomePage = () => {
  return (
    <Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }} gap={8} alignItems="stretch">
      <GridItem>
        <Stack spacing={6} h="100%" justify="center">
          <Text color="cyan.200" fontWeight="600" letterSpacing="widest">
            TRUSTED DIGITAL AWARENESS PLATFORM
          </Text>
          <Heading size={{ base: "xl", md: "2xl" }} lineHeight="1.2">
            Protect users from scams and decode complex bills in seconds.
          </Heading>
          <Text color="whiteAlpha.800" fontSize={{ base: "md", md: "lg" }}>
            One place to verify suspicious messages, simplify utility bills, and educate users
            with clear, friendly AI insights.
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
            <Button
              as={RouterLink}
              to="/scam"
              rightIcon={<Icon as={HiArrowRight} />}
              colorScheme="cyan"
              size="lg"
              borderRadius="full"
            >
              Analyze Scam Text
            </Button>
            <Button
              as={RouterLink}
              to="/bill"
              variant="outline"
              colorScheme="cyan"
              size="lg"
              borderRadius="full"
            >
              Analyze Bill Image
            </Button>
          </Stack>
        </Stack>
      </GridItem>

      <GridItem>
        <SimpleGrid columns={1} spacing={4}>
          <Box {...cardStyle}>
            <Stack direction="row" align="center" mb={3}>
              <Icon as={HiShieldCheck} boxSize={6} color="cyan.300" />
              <Heading size="md">Scam Detection</Heading>
            </Stack>
            <Text color="whiteAlpha.800">
              Evaluate suspicious text with risk labels and actionable reasoning for safer decisions.
            </Text>
          </Box>
          <Box {...cardStyle}>
            <Stack direction="row" align="center" mb={3}>
              <Icon as={HiDocumentReport} boxSize={6} color="purple.300" />
              <Heading size="md">Bill Simplifier</Heading>
            </Stack>
            <Text color="whiteAlpha.800">
              Upload a bill and get key details in plain language with short bullet points anyone can
              understand.
            </Text>
          </Box>
          <Box {...cardStyle}>
            <Stack direction="row" align="center" mb={3}>
              <Icon as={HiSparkles} boxSize={6} color="pink.300" />
              <Heading size="md">Begin Securely</Heading>
            </Stack>
            <Text color="whiteAlpha.800">
              Create your account and start analyzing real cases with an engaging, mobile-ready UI.
            </Text>
          </Box>
        </SimpleGrid>
      </GridItem>
    </Grid>
  );
};

export default HomePage;

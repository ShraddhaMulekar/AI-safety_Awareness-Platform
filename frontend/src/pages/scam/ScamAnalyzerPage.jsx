import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useFetch } from "../../hooks/UseFetch";
import { scamComponent } from "../../components/scam/ScamComponent";

const ScamAnalyzerPage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const { request, loading, error } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await scamComponent(request, text);
      let data = res?.data;

      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <Stack spacing={6}>
      <Box
        bg="whiteAlpha.120"
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="3xl"
        p={{ base: 5, md: 8 }}
      >
        <Heading size="lg" mb={2}>
          Scam Analyzer
        </Heading>
        <Text color="whiteAlpha.800" mb={6}>
          Paste suspicious text or messages to check if they look like a scam.
        </Text>

        <Box as="form" onSubmit={handleSubmit}>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: Congratulations! You won a lottery. Share your bank OTP."
            minH="180px"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            mb={4}
          />

          <Button type="submit" colorScheme="cyan" isLoading={loading} loadingText="Analyzing...">
            Analyze Text
          </Button>
        </Box>
      </Box>

      {error && (
        <Box bg="red.500" color="white" p={3} borderRadius="xl">
          {error}
        </Box>
      )}

      {result && (
        <Box
          bg="whiteAlpha.120"
          border="1px solid"
          borderColor="whiteAlpha.300"
          borderRadius="3xl"
          p={{ base: 5, md: 8 }}
        >
          <Stack direction={{ base: "column", sm: "row" }} align={{ base: "start", sm: "center" }} mb={3}>
            <Heading size="md">Analysis Result</Heading>
            <Badge
              colorScheme={
                result.risk?.toLowerCase()?.includes("high")
                  ? "red"
                  : result.risk?.toLowerCase()?.includes("medium")
                    ? "orange"
                    : "green"
              }
              px={3}
              py={1}
              borderRadius="full"
              fontSize="0.85rem"
            >
              Risk: {result.risk || "Unknown"}
            </Badge>
          </Stack>
          <Text color="whiteAlpha.900">{result.reason || "No reasoning returned by API."}</Text>
        </Box>
      )}
    </Stack>
  );
};

export default ScamAnalyzerPage;

import { useState } from "react";
import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useFetch } from "../../hooks/UseFetch";
import BillResult from "../../components/bill/BillComponent";
import BillService from "../../services/bill/BillService";

const BillAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const { loading, error, request } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!file) {
      alert("Please select an image");
      return;
    }

    try {
      const res = await BillService(request, file);
      // console.log("API RESPONSE:", res);
      setResult(res);
      if (!res?.ok) alert(res?.error || "Analysis failed");
    } catch (err) {
      console.error(err);
      alert("Error analyzing bill");
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
          Bill Analyzer
        </Heading>
        <Text color="whiteAlpha.800" mb={6}>
          Upload a bill image and receive a short, easy-to-understand explanation.
        </Text>

        <Box as="form" onSubmit={handleSubmit}>
          <Stack direction={{ base: "column", md: "row" }} spacing={4} align={{ base: "stretch", md: "center" }}>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              p={1}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />

            <Button colorScheme="purple" type="submit" isLoading={loading} loadingText="Analyzing...">
              Upload and Analyze
            </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Box bg="red.500" color="white" p={3} borderRadius="xl">
          {error}
        </Box>
      )}

      <BillResult data={result} />
    </Stack>
  );
};

export default BillAnalyzerPage;
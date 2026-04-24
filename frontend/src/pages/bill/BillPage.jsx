import { useState } from "react";
import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BillResult from "../../components/bill/BillComponent";
import BillService from "../../services/bill/BillService";
import SavedBillService from "../../services/bill/savedBillService";
import { useFetch } from "../../hooks/useFetchhook";
const BillAnalyzerPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const { loading, error, request } = useFetch();
  const { loading: saving, request: saveRequest } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setSaved(false);

    if (!file) {
      alert("Please select an image");
      return;
    }

    try {
      const res = await BillService(request, file);
      setResult(res);
      if (!res?.success) {
        alert(res?.error || "Analysis failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error analyzing bill");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const hasValidToken = token && token !== "null" && token !== "undefined";
    if (!hasValidToken) {
      navigate("/login", { state: { from: "/bill" } });
      return;
    }

    if (!result || !result.success) {
      alert("Please analyze a bill before saving.");
      return;
    }

    try {
      const res = await SavedBillService.saveBill(
        saveRequest,
        result.billData,
        result.extractedText,
      );

      if (res?.status === 401 || /unauthorized/i.test(res?.message || "")) {
        navigate("/login", { state: { from: "/bill" } });
        return;
      }

      if (res?.duplicate) {
        alert("This bill is already saved in your history!");
        return;
      }

      if (res?.success) {
        setSaved(true);
        alert("Bill saved to history successfully!");
      } else {
        alert(res?.message || "Failed to save bill.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving bill");
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
          Upload a bill image and receive a short, easy-to-understand
          explanation.
        </Text>

        <Box as="form" onSubmit={handleSubmit}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            align={{ base: "stretch", md: "center" }}
          >
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              p={1}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
            />

            <Button
              overflow="hidden"
              colorScheme="purple"
              type="submit"
              isLoading={loading}
              loadingText="Analyzing..."
              size="lg"
            >
              Upload & Analyze
            </Button>
          </Stack>
        </Box>
        
        <br />

        <Button
          colorScheme="purple"
          type="button"
          onClick={handleSave}
          isLoading={saving}
          loadingText="Saving..."
          size="lg"
        >
          Save for later
        </Button>
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

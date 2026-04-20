import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/UseFetch";
import SavedBillService from "../../services/bill/savedBillService";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const { loading, error, request } = useFetch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You are not logged in. Please log in now!");
      navigate("/login");
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await SavedBillService.getSavedBills(request);
        if (res?.status === 401) {
          alert("You are not logged in. Please log in now!");
          navigate("/login");
          return;
        }
        if (res?.ok) {
          setBills(res.bills || []);
        } else {
          alert(res?.message || "Failed to load saved bills.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBills();
  }, [token, request, navigate]);

  return (
    <Stack spacing={6}>
      <Box
        bg="whiteAlpha.120"
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="3xl"
        p={8}
      >
        <Heading size="lg" mb={2}>
          Saved Bill History
        </Heading>
        <Text color="whiteAlpha.800" mb={6}>
          View the bills you saved for later.
        </Text>

        {loading && bills.length === 0 && (
          <Box>
            <Spinner color="purple.300" />
          </Box>
        )}

        {error && (
          <Alert status="error" borderRadius="xl" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {!loading && bills.length === 0 && (
          <Text color="whiteAlpha.800">
            No saved bills yet. Analyze a bill and save it to see it here.
          </Text>
        )}

        <Stack spacing={4}>
          {bills.map((bill) => (
            <Box
              key={bill._id}
              p={6}
              border="1px solid"
              borderColor="whiteAlpha.300"
              borderRadius="2xl"
              bg="whiteAlpha.50"
            >
              <Heading size="md" mb={3}>
                {bill.billData?.type
                  ? `${bill.billData.type} bill`
                  : "Saved bill"}
              </Heading>

              <Text mb={2}>
                <strong>Total Amount:</strong> ₹{bill.billData?.total || "N/A"}
              </Text>

              {bill.billData?.unit && (
                <Text mb={2}>
                  <strong>Unit:</strong> {bill.billData.unit}
                </Text>
              )}

              {bill.billData?.summary && (
                <Text mb={2}>
                  <strong>Summary:</strong> {bill.billData.summary}
                </Text>
              )}

              <Text mb={2} color="whiteAlpha.800">
                <strong>Saved on:</strong>{" "}
                {new Date(bill.createdAt).toLocaleString()}
              </Text>

              {bill.extractedText && (
                <Box
                  mt={3}
                  p={4}
                  bg="whiteAlpha.900"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontWeight="600" mb={2} color="gray.700">
                    Extracted text
                  </Text>
                  <Text color="gray.700" fontSize="sm" whiteSpace="pre-wrap">
                    {bill.extractedText}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default HistoryPage;

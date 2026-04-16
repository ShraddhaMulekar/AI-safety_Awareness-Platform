import React from "react";
import { Box, Text, Heading } from "@chakra-ui/react";

const BillComponent = ({ data }) => {
  if (!data) {
    return (
      <p style={{ marginTop: "20px" }}>Upload a bill image to view summary.</p>
    );
  }

  const bill = data.billData;

  if (!bill) return null;

  return (
    <Box mt={5}>
      <Heading size="md">📊 Bill Analysis</Heading>

      {/* 🔥 TYPE BASED UI */}
      {bill.type === "electricity" || bill.type === "water" ? (
      
        <Box mt={4} p={10} border="1px solid #ccc" borderRadius="10px">
          <Text style={{ borderLeft: bill.type === "electricity" ? "5px solid yellow" : "5px solid green" }}>
            <strong>⚡ Type:</strong> {bill.type}
          </Text>
          <Text>
            <strong>Total Amount:</strong> ₹{bill.total || "N/A"}
          </Text>
          <Text>
            <strong>Units:</strong> {bill.unit || "N/A"}
          </Text>
          <Text>
            <strong>Due Date:</strong> {bill.dueDate || "N/A"}
          </Text>

          <Text mt={2}>
            <strong>Consumer Name:</strong> {bill.consumerName || "N/A"}
          </Text>
          <Text>
            <strong>Address:</strong> {bill.consumerAddress || "N/A"}
          </Text>

          <Text mt={2}>
            <strong>Bill Number:</strong> {bill.billNumber || "N/A"}
          </Text>
          <Text>
            <strong>Account Number:</strong> {bill.accountNumber || "N/A"}
          </Text>

          <Text mt={2}>
            <strong>Last Payment:</strong>
          </Text>
          <Text>Amount: {bill.lastPayment?.amount || "N/A"}</Text>
          <Text>Unit: {bill.lastPayment?.unit || "N/A"}</Text>

          <Text mt={3}>
            <strong>Summary:</strong>{" "}
            {bill.summary || "No short summary available."}
          </Text>
        </Box>
      ) : (
        <Box mt={4} p={4} border="1px solid #ccc" borderRadius="10px">
          <Text>
            <strong>🛒 Type:</strong> Other (Shopping)
          </Text>
          <Text>
            <strong>Total Amount:</strong> ₹{bill.total || "N/A"}
          </Text>
          <Text>
            <strong>Consumer Name:</strong> {bill.consumerName || "N/A"}
          </Text>

          <Text mt={2}>
            <strong>Total Items:</strong> {bill.itemCount || 0}
          </Text>

          <Text mt={2}>
            <strong>Items:</strong>
          </Text>
          <ul>
            {(bill.items || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <Text mt={3}>
            <strong>Summary:</strong> {bill.summary}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default BillComponent;

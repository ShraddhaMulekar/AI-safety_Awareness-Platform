import React from "react";
import { Text } from "@chakra-ui/react";

const BillComponent = ({ data }) => {
  if (!data) {
    return <p style={{ marginTop: "20px" }}>Upload a bill image to view summary.</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>📊 Bill Analysis</h2>

      <p>
        <strong>Total:</strong> {data.billData?.total || "N/A"}
      </p>

      <p>
        <strong>Summary:</strong> {data.billData?.summary || "No short summary available."}
      </p>

      <br />
      <Text textStyle="lg" fontWeight="bold">
        Easy To Understand
      </Text>
      <ul style={{ paddingLeft: "60px" }}>
        {(data.billData?.bullets || []).map((point, index) => (
          <li key={`${point}-${index}`} align="left">
            {point}
          </li>
        ))}
      </ul>

      {/* <details>
        <summary>Show technical details</summary>
        <p>
          <strong>Parser:</strong> {data.billData?.parser}
        </p>
        <h4>🧾 Extracted Text</h4>
        <pre>{data.extractedText}</pre>
      </details> */}
    </div>
  );
};

export default BillComponent;

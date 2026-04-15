import React from "react";

const BillComponent = ({ data }) => {
  console.log(data);
  if (!data) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>📊 Bill Analysis</h2>

      <p>
        <strong>Total:</strong> {data.billData?.total || "N/A"}
      </p>

      <p>
        <strong>Summary:</strong> {data.billData?.summary}
      </p>

      <p>
        <strong>Parser:</strong> {data.billData?.parser}
      </p>

      <h3>🧾 Extracted Text:</h3>
      <pre>{data.extractedText}</pre>
    </div>
  );
};

export default BillComponent;

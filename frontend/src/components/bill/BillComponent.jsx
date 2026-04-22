import React from "react";

const BillComponent = ({ data }) => {
  if (!data) {
    return (
      <p style={{ marginTop: "20px" }}>Upload a bill image to view summary.</p>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>📊 Bill Analysis</h2>

      <p>
        <strong>Bill Type:</strong> {data.billData?.category}
      </p>

      <p>
        <strong>Total:</strong> {data.billData?.total || "N/A"}
      </p>

      <p>
        <strong>Due Date:</strong> {data.billData?.dueDate || "N/A"}
      </p>

      {data.billData?.unit && (
        <p>
          <strong>Units:</strong> {data.billData.unit}
        </p>
      )}

      <p>
        <strong>Summary:</strong>{" "}
        {data.billData?.summary || "No short summary available."}
      </p>

      {typeof data.billData?.itemCount === "number" &&
        data.billData.itemCount > 0 && (
          <>
            <p>
              <strong>Item Count:</strong> {data.billData.itemCount}
            </p>
            <p>
              <strong>Calculated Total:</strong>{" "}
              {data.billData.calculatedTotal || "N/A"}
            </p>
            <p>
              <strong>Total Check:</strong>{" "}
              {data.billData.totalsMatch === null
                ? "Could not verify"
                : data.billData.totalsMatch
                  ? "Correct"
                  : "Mismatch found"}
            </p>
            {data.billData.mismatchNote && (
              <p>
                <strong>Check Result:</strong> {data.billData.mismatchNote}
              </p>
            )}
          </>
        )}

      <h3>Easy To Understand</h3>
      <ul>
        {(data.billData?.bullets || []).map((point, index) => (
          <li key={`${point}-${index}`}>{point}</li>
        ))}
      </ul>

      {Array.isArray(data.billData?.items) &&
        data.billData.items.length > 0 && (
          <>
            <h3>Detected Items</h3>
            <ul>
              {data.billData.items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  {item.name} | Qty: {item.quantity || 0} | Total: Rs{" "}
                  {item.total || "0.00"}
                </li>
              ))}
            </ul>
          </>
        )}

      <details>
        <summary>Show technical details</summary>
        <p>
          <strong>Parser:</strong> {data.billData?.parser}
        </p>
        <h4>🧾 Extracted Text</h4>
        <pre>{data.extractedText}</pre>
      </details>
    </div>
  );
};

export default BillComponent;

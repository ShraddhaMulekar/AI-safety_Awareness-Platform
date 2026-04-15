import { useState } from "react";
import { useFetch } from "../../hooks/UseFetch";
import BillResult from "../../components/bill/BillComponent";
import BillService from "../../services/bill/BillService";

const BillAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const { loading, error, request } = useFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    try {
      const res = await BillService(request, file);
      console.log("API RESPONSE:", res);

      if (res?.ok) {
        setResult(res);
      } else {
        alert(res?.error || "Analysis failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error analyzing bill");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧾 Bill Analyzer</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <BillResult data={result} />
    </div>
  );
};

export default BillAnalyzerPage;
import { useState } from "react";
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
    <div>
      <h1>Scam Analyzer</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze for scams..."
        />

        <button disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Risk: {result.risk}</h3>
          <p>Reason: {result.reason}</p>
        </div>
      )}
    </div>
  );
};

export default ScamAnalyzerPage;

import { useState } from "react";
import mockData, { KnowledgeGraphData } from "../../../../data/tempdata";

type RootOption = keyof KnowledgeGraphData;
type PropertyOption = string;

export default function DynamicForm() {
  const [root, setRoot] = useState<RootOption | "">("");
  const [property, setProperty] = useState<PropertyOption | "">("");
  const [detail, setDetail] = useState<string | "">("");

  // Handlers for each dropdown
  const handleRootChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoot(e.target.value as RootOption);
    setProperty(""); // Reset subsequent selections
    setDetail("");
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProperty(e.target.value);
    setDetail(""); // Reset detail selection
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDetail(e.target.value);
  };

  return (
    <div>
      {/* Row 1: Root Selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Category:
          <select value={root} onChange={handleRootChange}>
            <option value="">Select</option>
            {Object.keys(mockData).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Row 2: Property Selection - Options depend on the Root selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Property:
          <select value={property} onChange={handlePropertyChange} disabled={!root}>
            <option value="">Select</option>
            {root &&
              mockData[root].properties.map((prop) => (
                <option key={prop} value={prop}>
                  {prop}
                </option>
              ))}
          </select>
        </label>
      </div>

      {/* Row 3: Detail Selection - Options depend on the Property selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Detail:
          <select value={detail} onChange={handleDetailChange} disabled={!property}>
            <option value="">Select</option>
            {root && property && mockData[root][property]?.map((detailOption) => (
              <option key={detailOption} value={detailOption}>
                {detailOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Display selected details */}
      {root && property && detail && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Selected Details:</h3>
          <p>Root: {root}</p>
          <p>Property: {property}</p>
          <p>Detail: {detail}</p>
        </div>
      )}
    </div>
  );
}

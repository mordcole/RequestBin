import { Link } from "react-router-dom";
import { useState } from "react";
import { createBin } from "./services";
import { generateBinId } from "./utils";

const BinsPage = () => {
  const [urlInput, setUrlInput] = useState(generateBinId());




  return (
    <>
      <div>
        <h1>Bins</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const authToken = crypto.randomUUID();
              await createBin(urlInput, authToken);
              localStorage.setItem(`basket_${urlInput}`, authToken);
              setUrlInput(generateBinId());
            } catch (error) {
              alert("Failed to create a new bin.");
              console.error(error);
            }
          }}
        >
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="submit">Create New Bin</button>
        </form>
          <h2>My Baskets</h2>
          <ul>
            {Object.keys(localStorage).map((key) => (
              <li key={key}>
                <Link to={`/bins/${key.replace('basket_', '')}`}>{key.replace('basket_', '')}</Link>
              </li>
            ))}
          </ul>
      </div>
    </>
  );
};

export default BinsPage;

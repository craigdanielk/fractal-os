

/**
 * Cockpit Economics Page
 *
 * Displays contribution metrics for:
 *  - overall system
 *  - projects
 *  - clients
 *
 * Uses the Economics Engine API endpoints.
 */

import { useEffect, useState } from "react";
import { getEconomicsOverview } from "../services/api";

export default function EconomicsPage() {
  const [econ, setEcon] = useState<any>(null);

  useEffect(() => {
    getEconomicsOverview()
      .then(setEcon)
      .catch(() => setEcon(null));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Economics Overview</h1>

      {!econ ? (
        <p>Economics disabled or unavailable.</p>
      ) : (
        <pre>{JSON.stringify(econ, null, 2)}</pre>
      )}
    </div>
  );
}
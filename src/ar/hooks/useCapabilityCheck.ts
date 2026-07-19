/**
 * useCapabilityCheck — Pre-flight AR device capability detection hook
 */

import { useState, useEffect } from 'react';
import { detectCapabilities, type CapabilityResult } from '../engine/CapabilityDetector';

export interface UseCapabilityCheckResult {
  loading: boolean;
  result: CapabilityResult | null;
}

export function useCapabilityCheck(): UseCapabilityCheckResult {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CapabilityResult | null>(null);

  useEffect(() => {
    detectCapabilities()
      .then(setResult)
      .finally(() => setLoading(false));
  }, []);

  return { loading, result };
}

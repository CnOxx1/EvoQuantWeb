import { useState, useEffect } from 'react';
import { getPage } from '../api/endpoints';

export function usePageContent(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPage(slug)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [slug]);

  return { data, loading, error };
}

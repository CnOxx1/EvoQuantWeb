import { useState, useEffect } from 'react';
import { getSections } from '../api/endpoints';

export function useSectionContent(pageId) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pageId) return;
    setLoading(true);
    getSections(pageId)
      .then(res => { setSections(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [pageId]);

  return { sections, loading };
}

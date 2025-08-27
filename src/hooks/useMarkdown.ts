import { useEffect, useState } from "react";

export const useMarkdown = (fetch: () => Promise<string>) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch()
      .then((markdown) => {
        setMarkdown(markdown);
      })
      .catch((error) => {
        setMarkdown(`오류가 발생했습니다:\n${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetch]);
  return { markdown, loading };
};

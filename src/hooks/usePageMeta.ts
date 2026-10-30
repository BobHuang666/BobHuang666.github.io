/** 按路由动态更新 title / description / OG 标签 */
import { useEffect } from 'react';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | Bob Huang`;

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = metaDesc?.content ?? '';
    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

      const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const prevOgTitle = ogTitle?.content ?? '';
    const prevOgDesc = ogDesc?.content ?? '';
    if (ogTitle) ogTitle.content = `${title} | Bob Huang`;
    if (ogDesc && description) ogDesc.content = description;

    return () => {
      document.title = prev;
      if (metaDesc && prevDesc) metaDesc.content = prevDesc;
      if (ogTitle) ogTitle.content = prevOgTitle;
      if (ogDesc) ogDesc.content = prevOgDesc;
    };
  }, [title, description]);
}

import { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { throttle } from 'lodash-es';
import { ComponentPropsWithIsland, Header } from 'shared/types/index';

function isBottom() {
  return (
    document.documentElement.scrollTop + window.innerHeight >=
    document.documentElement.scrollHeight
  );
}

export function Aside(
  props: ComponentPropsWithIsland<{ headers: Header[]; pagePath: string }>
) {
  const [headers, setHeaders] = useState(props.headers || []);

  // For outline text highlight
  const [activeIndex, setActiveIndex] = useState(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const SCROLL_INTO_HEIGHT = 150;
  const NAV_HEIGHT = 72;

  useEffect(() => {
    // handle hmr
    if (import.meta.env.DEV) {
      import.meta.hot?.on('md(x)-changed', () => {
        import(
          /* @vite-ignore */ `${props.pagePath}?import&t=${Date.now()}`
        ).then((mod) => {
          setHeaders(mod.toc);
        });
      });
    }
  }, []);

  function setActiveLink() {
    const links = document.querySelectorAll<HTMLAnchorElement>(
      '.island-doc .header-anchor'
    );
    if (isBottom()) {
      setActiveIndex(links.length - 1);
      markerRef.current!.style.top = `${33 + (headers.length - 1) * 28}px`;
    } else {
      // Compute current index
      for (let i = 0; i < links.length; i++) {
        const topDistance = links[i].getBoundingClientRect().top;
        if (topDistance > NAV_HEIGHT && topDistance < SCROLL_INTO_HEIGHT) {
          const id = links[i].getAttribute('href');
          const index = headers.findIndex(
            (item: any) => item.id === id?.slice(1)
          );
          if (index > -1 && index !== activeIndex) {
            setActiveIndex(index);
            markerRef.current!.style.top = `${33 + index * 28}px`;
          } else {
            setActiveIndex(0);
            markerRef.current!.style.top = '33px';
          }
          break;
        }
      }
    }
  }

  useEffect(() => {
    if (!headers.length && markerRef.current) {
      markerRef.current.style.display = 'none';
    }
    const onScroll = throttle(
      function listen() {
        if (!headers.length) {
          return;
        }
        setActiveLink();
      },
      100,
      { trailing: true }
    );
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const renderHeader = (header: any, index: number) => {
    const isNested = header.depth > 2;
    return (
      <li key={header.text}>
        <a
          href={`#${header.id}`}
          onClick={(e) => {
            e.preventDefault();
            setTimeout(() => {
              setActiveLink();
            }, 300);
          }}
          className={`${styles.outlineLink} ${
            index == activeIndex ? styles.active : ''
          } ${isNested ? styles.nested : ''}`}
        >
          {header.text}
        </a>
      </li>
    );
  };

  return (
    <div className={styles.docAside}>
      <div className={styles.docsAsideOutline}>
        <div className={styles.content}>
          <div className={styles.outlineMarker} ref={markerRef}></div>
          <div className={styles.outlineTitle}>ON THIS PAGE</div>
          <nav>
            <ul className={styles.root}>{headers.map(renderHeader)}</ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
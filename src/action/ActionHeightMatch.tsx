import OBR from "@owlbear-rodeo/sdk";
import React, { useEffect, useRef } from "react";

function useActionHeightMatch() {
  const heightReferenceDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heightReferenceDivRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const height = entries[0].borderBoxSize[0].blockSize;
        OBR.action.setHeight(height);
      }
    });
    resizeObserver.observe(heightReferenceDivRef.current);
    return () => {
      OBR.action.setHeight(600);
      resizeObserver.disconnect();
    };
  }, [heightReferenceDivRef]);

  return heightReferenceDivRef;
}

export default function ActionHeightMatch({
  children,
}: {
  children: React.ReactNode;
}) {
  const heightReferenceDivRef = useActionHeightMatch();

  return <div ref={heightReferenceDivRef}>{children}</div>;
}

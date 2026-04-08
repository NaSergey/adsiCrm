import { useEffect, useState } from "react";

export function useIsMounted() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setIsMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return isMounted;
}
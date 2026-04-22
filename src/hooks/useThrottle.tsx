import { useEffect, useRef, useState } from "react"

const useThrottle = (value: number | string, limit: number) => {
    const [throttleValue, setThrottleValue] = useState(value);
    const lastRun = useRef(Date.now());

    useEffect(() => {
        const now = Date.now();
        if (now - lastRun.current >= limit) {
            setThrottleValue(value);
            lastRun.current = now;
        }
    }, [value, limit]);

    return throttleValue;
}

export default useThrottle;
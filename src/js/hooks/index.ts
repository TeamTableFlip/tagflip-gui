import {useEffect, useRef} from "react";

/**
 * Returns a reference to previous state
 * Implementation according to https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * @param value
 */
export function usePrevious<T = undefined>(value: T) : T {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value; // Update current (after ref.current has been already returned). useEffect is a callback and is being executed in the future.
    });
    return ref.current; // Return whatever current now is
}

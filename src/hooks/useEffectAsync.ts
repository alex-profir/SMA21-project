import { useEffect, useState } from "react"

type fnSignature = (() => any) | (() => Promise<any>)

function isPromise(obj: any): obj is Promise<any> {
    return typeof obj === "object" && "then" in obj;
}

export const useEffectAsync = (fn: fnSignature, deps: any[] = []) => {
    const [error, setError] = useState<any>(null);
    useEffect(() => {
        let cleanup = () => { };
        try {
            const fnResult = fn();
            if (fnResult) {
                if (isPromise(fnResult)) {
                    fnResult.then(cb => {
                        cleanup = cb;
                    }).catch(err => {
                        setError(err);
                    });
                } else {
                    if (typeof fnResult === "function")
                        cleanup = fnResult;
                }
            }
        } catch (e) {
            console.log({ e });
            setError(e);
        }

        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
    return {
        error
    }
}
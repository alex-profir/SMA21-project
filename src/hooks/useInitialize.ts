import { useEffect, useState } from "react"
import { useNavigation } from "../routes";
import { getCurrentUser } from "../services/auth.service";
import { useDispatch } from "../store";
import { retrieveStorageToken } from "../utils/utilFunctions";
import { useEffectAsync } from "./useEffectAsync";

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms))
}

const useInitialize = () => {
    const [checked, setChecked] = useState(false);
    const dispatch = useDispatch();
    useEffectAsync(async () => {

        // here to test the loader
        // await sleep(2000);
        
        try {
            await retrieveStorageToken();
            const req = await getCurrentUser();
            dispatch({
                type: "SET_USER",
                user: req.data,
            });
        } catch (err) {
            console.log(err);
        } finally {
            setChecked(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { checked };
}
export default useInitialize
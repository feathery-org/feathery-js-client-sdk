import fetchFlags from "./flags";

export function initialize(sdkKey, userKey) {
    let flags = {};
    const fetchPromise = fetchFlags(sdkKey, userKey, flags);

    function variation(key, defaultValue) {
        if (key in flags) {
            return flags[key];
        }
        return defaultValue;
    }

    function onReady(callback) {
        fetchPromise.done(callback);
    }

    return {
        onReady: onReady,
        variation: variation,
    };
}

import fetchFlags from "./flags";

export function initialize(organization_id, user_key) {
    let flags = {};
    const fetchPromise = fetchFlags(organization_id, user_key, flags);

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

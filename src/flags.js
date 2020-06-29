import $ from "jquery";

export default function fetchFlags(sdkKey, userKey, flags) {

    const url = (
        "https://cdn.feathery.tech/external/" +
        encodeURIComponent(userKey) + "/"
    );
    const urlSettings = {
        url,
        cache: false,
        headers: {Authorization: "Token " + sdkKey},
    }
    return $.get(urlSettings, function( data ) {
        data.forEach(function( info ) {
            flags[info["key"]] = info["value"];
        });
    });
}

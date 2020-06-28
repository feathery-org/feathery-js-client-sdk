import $ from "jquery";

export default function fetchFlags(organizationId, userKey, flags) {

    const url = (
        "https://cdn.feathery.tech/external/" +
        encodeURIComponent(userKey) + "/"
    );
    const urlSettings = {
        url,
        cache: false,
        headers: {Authorization: "Token " + organizationId},
    }
    return $.get(urlSettings, function( data ) {
        data.forEach(function( info ) {
            flags[info["key"]] = info["value"];
        });
    });
}

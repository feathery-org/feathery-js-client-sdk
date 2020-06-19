import $ from "jquery";

export default function fetchFlags(organizationId, userKey, flags) {

    const url = (
        "https://cdn.feathery.tech/external/" +
        encodeURIComponent(organizationId) + "/" +
        encodeURIComponent(userKey) + "/"
    );
    return $.get({url, cache:false}, function( data ) {
        data.forEach(function( info ) {
            flags[info["key"]] = info["value"];
        });
    });
}

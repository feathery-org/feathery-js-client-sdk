import {afterEach, beforeEach, describe, expect, it} from "@jest/globals";
import sinon from "sinon";

import * as FeatheryClient from "../index";

describe("FeatheryClient", () => {
    const userKey = "user";
    const orgId = "orgId";
    let server;

    beforeEach(() => {
        server = sinon.createFakeServer();
        server.autoRespond = true;
        server.autoRespondAfter = 100;
        // default 200 response
        server.respondWith([
            200,
            {"Content-Type": "application/json" },
            "[{\"key\": \"test_key\", \"value\": true, \"datatype\": \"boolean\"}]",
        ]);
    });

    afterEach(() => {
        server.restore();
    });

    it("client exists", () => {
        expect(FeatheryClient).toBeDefined();
    });

    it("query sync", () => {
        const client = FeatheryClient.initialize(orgId, userKey);
        const val = client.variation("test_key", false);
        expect(val).toEqual(false);
    });

    it("query async", () => {
        const client = FeatheryClient.initialize(orgId, userKey);
        client.onReady(() => {
            const val = client.variation("test_key", false);
            expect(val).toEqual(true);
        });
    });
});

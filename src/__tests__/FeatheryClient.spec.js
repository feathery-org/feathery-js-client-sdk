import {beforeEach, describe, expect, it, jest} from "@jest/globals";

import FeatheryClient from "../index";

describe("FeatheryClient", () => {
    const userKey = "user";
    const orgId = "orgId";

    global.fetch = jest.fn(() => {
        return Promise.resolve({
            status: 200,
            json: () => [{"key": "test_key", "value": true, "datatype": "boolean"}],
        });
    });

    beforeEach(() => {
        fetch.mockClear();
    });

    it("client exists", () => {
        expect(FeatheryClient).toBeDefined();
    });

    it("query sync", () => {
        const client = new FeatheryClient(orgId, userKey);
        const val = client.variation("test_key", false);
        expect(val).toEqual(false);
    });

    it("query async", async done => {
        const client = new FeatheryClient(orgId, userKey);
        await client.resolve
            .then(() => {
                const val = client.variation("test_key", false);
                expect(val).toEqual(true);
                done();
            }).catch((e) => {
                done.fail(e);
            });
    });
});

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

describe("FeatheryClient", () => {
    global.fetch_panel = jest.fn(() => {
        return Promise.resolve({
            status: 200,
            json: {
                "header": "Welcome to Zendesk",
                "description": "We serve 2,000 academic institutions worldwide",
                "servars": [
                  {
                    "id": "91a963fd-23ba-4ef9-bb21-14740319dd60",
                    "name": "What's your role?",
                    "key": "role",
                    "type": "select",
                    "metadata": {
                      "options": [
                        "School Administrator",
                        "Executive Assistant",
                        "IT"
                      ]
                    },
                    "value": "School Administrator"
                  },
                  {
                    "id": "e426fb0b-58d4-4519-b955-95fa054a53ca",
                    "name": "What educational stage does your school serve?",
                    "key": "educational_stage",
                    "type": "select",
                    "metadata": {
                      "options": [
                        "University",
                        "Grade School",
                        "Preschool"
                      ]
                    },
                    "value": "University"
                  },
                  {
                    "id": "6f474b27-3dd9-4d0e-b24d-7897ee12cd67",
                    "name": "What are you using Zendesk for?",
                    "key": "use",
                    "type": "multiple_checkbox",
                    "metadata": {
                      "options": [
                        "Managing student support tickets",
                        "Recruiting prospective students",
                        "Engage students in communication"
                      ]
                    },
                    "value": "[False, False, False]"
                  }
                ]  
              }
        })
    })

    it("panel", async done => {
        const client = new FeatheryClient(orgId, userKey)
        await client.resolve
            .then(() => {
                console.log()
            })
    })
})

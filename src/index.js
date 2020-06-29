import * as errors from "./errors";

export const featheryErrors = errors;

export default class FeatheryClient {
	constructor(sdkKey, userKey) {
		FeatheryClient.validateKeys(sdkKey, userKey);

		this._sdkKey = sdkKey;
		this._userKey = userKey;

		this.state = {
			loaded: false,
			flags: null,
		};
	}

	static validateKeys(sdkKey, userKey) {
		if (!sdkKey || typeof sdkKey !== "string") {
			throw new errors.SdkKeyError("Invalid SDK Key");
		}
		if (!userKey || typeof userKey !== "string") {
			throw new errors.UserKeyError("Invalid User Key");
		}
	}

	get flags() {
		return this.state.flags;
	}

	get loaded() {
		return this.state.loaded;
	}

	get sdkKey() {
		return this._sdkKey;
	}

	get userKey() {
		return this._userKey;
	}

	set flags(flags) {
		if (flags === null) {
			this.state.flags = null;
			this.state.loaded = false;
		} else {
			this.state.flags = flags;
			this.state.loaded = true;
		}
	}

	variation(key, def) {
		if (!this.state.loaded || !(key in this.flags)) {
			return def;
		}
		return this.flags[key];
	}

	setFlags(json) {
		const flags = {};
		json.forEach((flag) => (flags[flag.key] = flag.value));
		this.flags = flags;
	}

	fetch() {
		const { _userKey: userKey, _sdkKey: sdkKey } = this;
		FeatheryClient.validateKeys(userKey, sdkKey);
		const url = `https://cdn.feathery.tech/external/${encodeURIComponent(userKey)}/`;
		const options = {
			cache: "no-store",
			headers: { Authorization: "Token " + sdkKey },
		};
		this.flags = null;
		return fetch(url, options)
			.then((response) => {
				const { status } = response;
				switch (status) {
					case 200:
						return response.json();
					case 401:
						return Promise.reject(new errors.SdkKeyError("Invaid SDK key"));
					case 404:
						return Promise.reject(new errors.UserKeyError("Invaid User key"));
					default:
						return Promise.reject(new errors.FetchError("Unknown error"));
				}
			})
			.then((json) => {
				this.setFlags(json);
				return this.flags;
			})
			.catch((error) => {
				throw error instanceof TypeError ? new errors.FetchError("Could not connect to the server") : error;
			});
	}
}

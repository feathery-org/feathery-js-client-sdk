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

		this._fetchPromise = null;
		this.fetch();
	}

	static validateKeys(sdkKey, userKey) {
		if (!sdkKey || typeof sdkKey !== "string") {
			throw new errors.SdkKeyError("Invalid SDK Key");
		}
		if (!userKey || typeof userKey !== "string") {
			throw new errors.UserKeyError("Invalid User Key");
		}
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

	get fetchPromise(){
		return this._fetchPromise !== null ? this._fetchPromise : Promise.resolve(this.state.flags);
	}

	variation(key, def) {
		if (!this.state.loaded || !(key in this.state.flags)) {
			return def;
		}
		return this.state.flags[key];
	}

	setFlags(json) {
		if(json === null){
			this.state.flags = null;
			this.state.loaded = false;
			return
		}
		const flags = {};
		json.forEach((flag) => (flags[flag.key] = flag.value));
		this.state.flags = flags;
		this.state.loaded = true;
	}

	fetch() {
		if(this._fetchPromise !== null){
			return;
		}
		const { _userKey: userKey, _sdkKey: sdkKey } = this;
		FeatheryClient.validateKeys(userKey, sdkKey);
		const url = `https://cdn.feathery.tech/external/${encodeURIComponent(userKey)}/`;
		const options = {
			cache: "no-store",
			headers: { Authorization: "Token " + sdkKey },
		};
		this.setFlags(null);
		this._fetchPromise = fetch(url, options)
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
				this._fetchPromise = null;
				return this.state.flags;
			})
			.catch((error) => {
				this._fetchPromise = null;
				throw error instanceof TypeError ? new errors.FetchError("Could not connect to the server") : error;
			});
	}
}

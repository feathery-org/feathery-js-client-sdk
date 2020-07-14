import * as errors from "./errors";

export const featheryErrors = errors;

export default class FeatheryClient {
	constructor(sdkKey, userKey) {
		FeatheryClient.validateKeys(sdkKey, userKey);

		this._sdkKey = sdkKey;
		this._userKey = userKey;

		this.state = {
			loaded: false,
			settings: null,
		};

		this._resolve = null;
		this._fetch();
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

	get resolve() {
		return this._resolve !== null ? this._resolve : Promise.resolve(this.state.settings);
	}

	variation(key, def) {
		if (!this.state.loaded || !(key in this.state.settings)) {
			return def;
		}
		return this.state.settings[key];
	}

	setSettings(json) {
		if (json === null) {
			this.state.settings = null;
			this.state.loaded = false;
			return;
		}
		const settings = {};
		json.forEach((setting) => (settings[setting.key] = setting.value));
		this.state.settings = settings;
		this.state.loaded = true;
	}

	_fetch() {
		if (this._resolve !== null) {
			return;
		}
		const { _userKey: userKey, _sdkKey: sdkKey } = this;
		FeatheryClient.validateKeys(userKey, sdkKey);
		const url = `https://cdn.feathery.tech/external/fuser/?fuser_key=${encodeURIComponent(userKey)}`;
		const options = {
			cache: "no-store",
			headers: { Authorization: "Token " + sdkKey },
		};
		this.setSettings(null);
		this._resolve = fetch(url, options)
			.then((response) => {
				const { status } = response;
				switch (status) {
					case 200:
						return response.json();
					case 401:
						return Promise.reject(new errors.SdkKeyError("Invalid SDK key"));
					case 404:
						return Promise.reject(new errors.UserKeyError("Invalid User key"));
					default:
						return Promise.reject(new errors.FetchError("Unknown error"));
				}
			})
			.then((json) => {
				this.setSettings(json);
				this._resolve = null;
				return this.state.settings;
			})
			.catch((error) => {
				this._resolve = null;
				throw error instanceof TypeError ? new errors.FetchError("Could not connect to the server") : error;
			});
	}
}

import * as dotenv from 'dotenv';
dotenv.config();

interface IParms {
	username: string;
	password: string;
	authProvider?: string;
	type: string;
}

interface IReturns {
	status: number;
	message: string;
}

export const netspectiveAuthentication = (parms: IParms): Promise<IReturns> => {
	const { username, password, authProvider, type } = parms;
	const authUrl: string =
		process.env.REACT_APP_KEYCLOAK_AUTHURL +
		process.env.REACT_APP_KEYCLOAK_REALM +
		process.env.REACT_APP_KEYCLOAK_TOKENURL;
	const userInfoUrl: string =
		process.env.REACT_APP_KEYCLOAK_AUTHURL +
		process.env.REACT_APP_KEYCLOAK_REALM +
		process.env.REACT_APP_KEYCLOAK_USERINFOURL;

	var urlencoded = new URLSearchParams();
	var keycloakUrlEncoded = new URLSearchParams();
	keycloakUrlEncoded.append('client_id', process.env.REACT_APP_KEYCLOAK_CLIENTID);
	keycloakUrlEncoded.append('client_secret', process.env.REACT_APP_KEYCLOAK_CLIENTSECRET);

	if (authProvider) {
		if (authProvider === 'gitlab') {
			if (type === 'login') {
				if (username && password) {
					urlencoded.append('username', username);
					urlencoded.append('password', password);
					urlencoded.append('grant_type', 'password');
					urlencoded.append('scope', 'openid');
					return fetchAction(process.env.REACT_APP_GITLAB_AUTHURL, urlencoded).then((responseVal) => {
						if (responseVal.statusText) {
							return Promise.resolve({
								status: Number(responseVal.status),
								message: String(responseVal.statusText),
							});
						} else {
							localStorage.setItem('access_token', responseVal.access_token);
							localStorage.setItem('id_token', responseVal.id_token);
							localStorage.setItem('refresh_token', responseVal.refresh_token);
							return Promise.resolve({
								status: 200,
								message: 'login_successful',
							});
						}
					});
				} else {
					return Promise.resolve({
						status: 0,
						message: 'Empty username or password',
					});
				}
			} else if (type === 'refresh') {
				urlencoded.append('grant_type', 'refresh_token');
				urlencoded.append('scope', 'openid');
				urlencoded.append('refresh_token', localStorage.getItem('refresh_token') || '{}');
				return fetchAction(process.env.REACT_APP_GITLAB_AUTHURL, urlencoded).then((responseVal) => {
					if (responseVal.statusText) {
						return Promise.resolve({
							status: Number(responseVal.status),
							message: String(responseVal.statusText),
						});
					} else {
						localStorage.setItem('access_token', responseVal.access_token);
						localStorage.setItem('id_token', responseVal.id_token);
						localStorage.setItem('refresh_token', responseVal.refresh_token);
						return Promise.resolve({
							status: 200,
							message: 'refresh_successful',
						});
					}
				});
			} else {
				return Promise.reject({
					status: 400,
					message: 'undefined_type',
				});
			}
		} else if (authProvider === 'keycloak') {
			if (type === 'login') {
				if (username && password) {
					keycloakUrlEncoded.append('username', username);
					keycloakUrlEncoded.append('password', password);
					keycloakUrlEncoded.append('grant_type', 'password');
					return fetchAction(authUrl, keycloakUrlEncoded).then((responseVal) => {
						if (responseVal.statusText) {
							return Promise.resolve({
								status: Number(responseVal.status),
								message: String(responseVal.statusText),
							});
						} else {
							localStorage.setItem('access_token', responseVal.access_token);
							localStorage.setItem('refresh_token', responseVal.refresh_token);
							return fetchActionKeyCloakUserInfo(userInfoUrl, responseVal.access_token).then(
								(responseVal) => {
									if (responseVal.statusText) {
										return Promise.resolve({
											status: Number(responseVal.status),
											message: String(responseVal.statusText),
										});
									} else {
										localStorage.setItem('userInfo', JSON.stringify(responseVal));
										return Promise.resolve({
											status: 200,
											message: 'login_successful',
										});
									}
								}
							);
						}
					});
				} else {
					return Promise.resolve({
						status: 0,
						message: 'Empty username or password',
					});
				}
			} else if (type === 'refresh') {
				keycloakUrlEncoded.append('grant_type', 'refresh_token');
				keycloakUrlEncoded.append('refresh_token', JSON.parse(localStorage.getItem('refresh_token') || '{}'));
				return fetchAction(authUrl, keycloakUrlEncoded).then((responseVal) => {
					if (responseVal.statusText) {
						return Promise.resolve({
							status: Number(responseVal.status),
							message: String(responseVal.statusText),
						});
					} else {
						localStorage.setItem('access_token', responseVal.access_token);
						localStorage.setItem('refresh_token', responseVal.refresh_token);
						return Promise.resolve({
							status: 200,
							message: 'refresh_successful',
						});
					}
				});
			} else {
				return Promise.reject();
			}
		} else {
			return Promise.reject({
				status: 400,
				message:
					'undefined_authProvider; authProvider can be gitlab, keycloak and "" ; Please gothrough readme for usecases.',
			});
		}
	} else {
		if (type === 'login') {
			if (username && password) {
				urlencoded.append('username', username);
				urlencoded.append('password', password);
				keycloakUrlEncoded.append('username', username);
				keycloakUrlEncoded.append('password', password);
				urlencoded.append('grant_type', 'password');
				urlencoded.append('scope', 'openid');
				keycloakUrlEncoded.append('grant_type', 'password');
				return fetchAction(process.env.REACT_APP_GITLAB_AUTHURL, urlencoded).then((responseValGit) => {
					if (responseValGit.statusText) {
						return Promise.resolve({
							status: Number(responseValGit.status),
							message: String(responseValGit.statusText),
						});
					} else {
						localStorage.setItem('gitlab_access_token', responseValGit.access_token);
						localStorage.setItem('gitlab_id_token', responseValGit.id_token);
						localStorage.setItem('gitlab_refresh_token', responseValGit.refresh_token);
						return fetchAction(authUrl, keycloakUrlEncoded).then((responseValKey) => {
							localStorage.setItem('access_token', responseValKey.access_token);
							localStorage.setItem('refresh_token', responseValKey.refresh_token);
							return Promise.resolve({
								status: 200,
								message: 'login_successful',
							});
						});
					}
				});
			} else {
				return Promise.resolve({
					status: 0,
					message: 'Empty username or password',
				});
			}
		} else if (type === 'refresh') {
			urlencoded.append('grant_type', 'refresh_token');
			urlencoded.append('scope', 'openid');
			urlencoded.append('refresh_token', JSON.parse(localStorage.getItem('refresh_token') || '{}'));
			keycloakUrlEncoded.append('grant_type', 'refresh_token');
			keycloakUrlEncoded.append('refresh_token', JSON.parse(localStorage.getItem('refresh_token') || '{}'));
			return fetchAction(process.env.REACT_APP_GITLAB_AUTHURL, urlencoded).then((responseValGit) => {
				if (responseValGit.statusText) {
					return Promise.resolve({
						status: responseValGit.status,
						message: responseValGit.statusText,
					});
				} else {
					localStorage.setItem('gitlab_access_token', responseValGit.access_token);
					localStorage.setItem('gitlab_id_token', responseValGit.id_token);
					localStorage.setItem('gitlab_refresh_token', responseValGit.refresh_token);
					return fetchAction(authUrl, keycloakUrlEncoded).then((responseValKey) => {
						localStorage.setItem('access_token', responseValKey.access_token);
						localStorage.setItem('refresh_token', responseValKey.refresh_token);
						return Promise.resolve({
							status: 200,
							message: 'refresh_successful',
						});
					});
				}
			});
		} else {
			return Promise.reject({
				status: 400,
				message: 'undefined_type',
			});
		}
	}
};

const fetchAction = (url: string, urlencoded: URLSearchParams) => {
	const request = new Request(url, {
		method: 'POST',
		body: urlencoded,
		headers: new Headers({
			'Content-Type': 'application/x-www-form-urlencoded',
		}),
	});

	return fetch(request)
		.then((response) => {
			if (response.status < 200 || response.status >= 300) {
				return response;
				throw new Error(response.statusText);
			}
			return response.json();
		})
		.then((authResponse) => {
			return authResponse;
		});
};

const fetchActionKeyCloakUserInfo = (url: string, token: string) => {
	const request = new Request(url, {
		method: 'GET',
		headers: new Headers({
			'Content-Type': 'application/json',
			Authorization: token && 'bearer ' + token,
		}),
	});

	return fetch(request)
		.then((response) => {
			if (response.status < 200 || response.status >= 300) {
				return response;
				throw new Error(response.statusText);
			}
			return response.json();
		})
		.then((authResponse) => {
			return authResponse;
		});
};

export const netspectiveAuthLogout = () => {
	localStorage.setItem('access_token', '');
	localStorage.setItem('refresh_token', '');
	return {
		status: 200,
		message: 'logout_successful',
	};
};

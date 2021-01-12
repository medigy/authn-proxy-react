import { ConfigKeyCloak } from "./webpack.config";

export const keyCloakUserInfo = (token) => {
  const userInfoUrl = ConfigKeyCloak.authUrl + ConfigKeyCloak.realm + ConfigKeyCloak.userInfoUrl;

  return fetchAction(userInfoUrl, token).then((responseVal) => {
    if (responseVal.statusText) {
      return Promise.resolve({
        status: responseVal.status,
        message: responseVal.statusText
      });
    } else {
      localStorage.setItem("userInfo", JSON.stringify(responseVal));
      return Promise.resolve({
        status: 200,
        message: "get_userInfo_success"
      });
    }
  });
};


const fetchAction = (url, token) => {
  const request = new Request(url, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": token && "bearer " + token 
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

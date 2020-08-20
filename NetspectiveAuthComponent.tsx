import { Config } from "./webpack.config";

export const netspectiveAuthLogin = (username, password) => {
  const request = new Request(Config.authUrl, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "password",
      username: username,
      password: password,
      scope: Config.scope,
      client_id: Config.clientId,
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  return fetch(request)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        return {
          status: response.status,
          message: response.statusText,
        };
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((authResponse) => {
      if (authResponse && typeof authResponse.access_token !== "undefined") {
        localStorage.setItem("token", authResponse.access_token);
        localStorage.setItem("id_token", authResponse.id_token);
        localStorage.setItem("refresh_token", authResponse.refresh_token);
        return {
          status: 200,
          message: "login_successful",
        };
      } else {
      }
    });
};

export const netspectiveAuthRefreshToken = () => {
  const refreshTokenLocal = localStorage.getItem("refresh_token");
  const request = new Request(Config.authUrl, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshTokenLocal,
      scope: "openid api profile email",
      client_id:
        "d99f26bb232a9ea6f2025dc759682326b6dc70cedbcac9bd50eb09d87c70e712",
    }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  return fetch(request)
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        return {
          status: response.status,
          message: response.statusText,
        };
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((authResponse) => {
      if (authResponse && typeof authResponse.access_token !== "undefined") {
        localStorage.setItem("token", authResponse.access_token);
        localStorage.setItem("id_token", authResponse.id_token);
        localStorage.setItem("refresh_token", authResponse.refresh_token);
        return {
          status: 200,
          message: "refresh_successful",
        };
      } else {
        return {
          status: "",
          message: "refresh_error",
        };
      }
    });
};

export const netspectiveAuthLogout = () => {
  localStorage.setItem("token", "");
  localStorage.setItem("id_token", "");
  localStorage.setItem("refresh_token", "");
  return {
    status: 200,
    message: "logout_successful",
  };
}
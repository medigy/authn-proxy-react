# Authentication Proxy React

## Installation

---

Clone component from [Authentication proxy react git repository](https://github.com/medigy/authn-proxy-react).

```bash
    git clone https://github.com/medigy/authn-proxy-react.git
```

Add component to the react project as a dependency using npm

```bash
    npm install path_to\authn-proxy-react
```

## Functions

#### 1. netspectiveAuthLogin ( )

For authenticating user using git lab.

```javascript
netspectiveAuthLogin(username, password).then((response) => {
  console.log(response);
});
```

#### 2. netspectiveAuthRefreshToken ( )

When ever an unauthorized or forbidden error occurs, use netspectiveAuthRefreshToken ( ).

```javascript
netspectiveAuthRefreshToken().then((response) => {
  console.log(response);
});
```

After authenticating or refreshing token, the functions sets or update id_token, access_token, refresh_token in local storage and returns a response object which holds the status and a message.

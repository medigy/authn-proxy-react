# Authentication Flow React Component

## Installation

---

Clone component from [Authentication flow react component git repository](https://git.netspective.io/information-governance-suite/authentication/authentication-flow-react-component).

```bash
    git clone git@git.netspective.io:information-governance-suite/authentication/authentication-flow-react-component.git
```

Add component to the react project as a dependency using npm

```bash
    npm install path_to\authentication-flow-react-component
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

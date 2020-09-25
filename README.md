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

OR

Create .npmrc file in project root and add the github package registry code given below.

```bash
    //npm.pkg.github.com/:_authToken= [Personal Access Token]
    @medigy:registry=https://npm.pkg.github.com
```

Then, run command

```bash
    npm install @medigy/authn-proxy-react
```

## Functions

#### 1. netspectiveAuthentication ( )

For authenticating user using gitlab.

```javascript
netspectiveAuthentication(parms).then((response) => {
  console.log(response);
});
```

parms is an object with following keys.

```javascript
parms = {
      username : values.username,
      password : values.password,
      authProvider : '',
      type : 'login'
    }
```

| Key          | Value                                                                                                            | Use Case              |
|--------------|------------------------------------------------------------------------------------------------------------------|-----------------------|
| username     | login username                                                                                                   | for login only        |
| password     | login password                                                                                                   | for login only        |
| authProvider | specify auth provider. ie. 'gitlab' , 'keyclock'. If we need to authenticate with keyclock and gitlab, pass ' '. | for login and refresh |
| type         | 'login', 'refresh'                                                                                               | for login and refresh |

When ever an unauthorized or forbidden error occurs, use netspectiveAuthentication ( ) with refresh type.
After authenticating or refreshing token, the functions sets or update id_token, access_token, refresh_token in local storage and returns a response object which holds the status and a message.


#### 2. netspectiveAuthLogout ( )

For Logout,

```javascript
netspectiveAuthLogout().then((response) => {
  console.log(response);
});
```



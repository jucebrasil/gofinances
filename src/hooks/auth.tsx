import React, {
  createContext,
  ReactNode,
  useContext,
  useState
} from 'react';

import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;

}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string
}

const AuthContext = createContext({} as IAuthContextData); /* valor inicial */

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);

  async function signInWithGoogle() {
    try {
      const CLIENT_ID = '682730717547-k6k318p6mogis6lpct9ai45opvkdlk5q.apps.googleusercontent.com';
      const REDIRECT_URI = 'https://auth.expo.io/@jucebrasil/gofinances';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = await AuthSession
        .startAsync({ authUrl }) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();

        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        });
      }


      //console.log(response);


    } catch (error) {
      console.log(error);
      //throw new Error(error);

    }
  }


  return (

    <AuthContext.Provider value={{
      user,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth }

// links uteis => 
// https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
// https://console.cloud.google.com/apis/credentials?project=gofinances-323521
// https://docs.expo.dev/guides/authentication/
// https://docs.expo.dev/versions/latest/sdk/auth-session/

// Também foi necessario executar o comando expo login




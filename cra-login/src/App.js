import pkceChallenge from 'pkce-challenge'
import {useState} from "react";

function App() {
    const code = new URLSearchParams(window.location.search).get('code');
    const [tokens, setTokens] = useState({access_token: '', id_token: ''})

    const sendRequest = () => {
        const code_verifier = sessionStorage.getItem("code_verifier");
        sessionStorage.removeItem('code_verifier');
        console.log(code_verifier)
        if (code?.length > 0) {
            fetch('http://127.0.0.1:8080/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                redirect: 'error',
                body:
                    new URLSearchParams(
                        {
                            grant_type: 'authorization_code',
                            code,
                            client_id: 'clientId',
                            code_verifier,
                            redirect_uri: 'http://127.0.0.1:3000/oauth2/code',
                        }).toString()
            }).then(r => r.json().then(body => {
                sessionStorage.setItem("token", JSON.stringify(body))
                setTokens(body);
            }))
        }
    }
    const login = () => {
        const {code_verifier, code_challenge} = pkceChallenge()
        sessionStorage.setItem("code_verifier", code_verifier);
        console.log(code_verifier)
        const loginQueryParams = new URLSearchParams({
            client_id: 'clientId',
            scope: 'openid',
            redirect_uri: 'http://127.0.0.1:3000/oauth2/code',
            response_mode: 'query',
            response_type: 'code',
            code_challenge_method: 'S256',
            code_challenge: code_challenge
        })

        window.location.href = 'http://127.0.0.1:8080/oauth2/authorize?' + loginQueryParams.toString();
    }

    const authenticatedRequest = () => {
        fetch('/info', {
            redirect: 'error',
            credentials: "omit",
            headers: {
                "Authorization": "Bearer " + tokens.access_token,
                "Content-Type": "application/json"
            }
        }).then(body => body.json().then(console.log));
    }

    return (
        <>
            <div className="App" style={{display: 'flex', justifyContent: 'space-around'}}>

                <button onClick={() => login()}>login</button>

                <button onClick={() => sendRequest()}>get token</button>


            </div>
            <p>{tokens.access_token}</p>

            <button onClick={() => authenticatedRequest()}>sendRequest</button>

        </>
    );
}

export default App;

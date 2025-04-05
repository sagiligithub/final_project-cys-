import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import PremiumContent from "./PremiumContent";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

import { getUser, getToken, setUserSession, resetUserSession } from "./service/AuthService";
import axios from "axios";

const verifyTokenAPIURL = 'https://20892zxe0d.execute-api.us-east-1.amazonaws.com/prod/verify';

function App() {
  const [currentTip, setCurrentTip] = useState("");
  const [isAuthenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token || token === 'undefined') {
      setAuthenticating(false);
      return;
    }

    const requestConfig = {
      headers: {
        'x-api-key': 'zTgexkZQhD7ZoH3yQOn639Ar46BWx3Fs56c1cb8B'
      }
    };

    const requestBody = {
      user: getUser(),
      token: token
    };

    axios.post(verifyTokenAPIURL, requestBody, requestConfig)
      .then(response => {
        setUserSession(response.data.user, response.data.token);
        setAuthenticating(false);
      })
      .catch(() => {
        resetUserSession();
        setAuthenticating(false);
      });
  }, []);

  // ✅ Use useMemo to avoid unnecessary re-renders
  const securityTips = useMemo(() => [
    "🔒 Use a strong, unique password for each account.",
    "🛡️ Enable Two-Factor Authentication (2FA) wherever possible.",
    "⚠️ Never click on suspicious links in emails or messages.",
    "📲 Keep your software and operating system up to date.",
    "🔍 Always verify website URLs before entering sensitive information.",
    "🚫 Avoid using public Wi-Fi for sensitive transactions.",
    "🔐 Regularly update and scan your devices for malware.",
    "👀 Be cautious of phishing emails requesting personal information.",
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = securityTips[Math.floor(Math.random() * securityTips.length)];
      setCurrentTip(randomTip);
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [securityTips]); // ✅ Now stable across renders

  const token = getToken();
  if (isAuthenticating && token) {
    return <div className="content">Authenticating...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        {/* ✅ Security Tip Box (Visible on All Pages) */}
        <div className="security-tip-box">
          <span className="bulb-icon">💡</span>
          <p>{currentTip}</p>
        </div>

        {/* Navigation Links */}
        <div className="header">
          <NavLink exact activeClassName="active" to="/">Home</NavLink>
          <NavLink activeClassName="active" to="/register">Register</NavLink>
          <NavLink activeClassName="active" to="/login">Login</NavLink>
          <NavLink activeClassName="active" to="/premium-content">Premium Content</NavLink>
        </div>

        {/* Page Content */}
        <div className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <PublicRoute path="/register" component={Register} />
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/premium-content" component={PremiumContent} />
          </Switch>
        </div>

        {/* Logo (Top Right) - Visible on All Pages */}
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABF1BMVEWkEj/////8//+iADihFD+dACWiADD//v+iADT5/f+hCjqnET/59fSxPV2jE0GlEUHGjpm/XXieACqhADb16+ufAC3iw82nADmeADaaAC+mADekADO3Tmv9+v2cACOnAD3dt8KlACzTn6ubACzr09urL1TYqrbYpLPQjJ62RmevJE/PpK7BdYn89frIf5X06O3Ulqft3OCoJUudAB3KfZPp19/cq7vBVnWyT3D97fTrz9y9bIK7YnrbvMjsxM21bH3DdI6uLVjIZYScAA/UkKPfn7HRc5HXiKC2fpLctLunNlnk09iyPVupR2HAYH2+WHGkI0/DkKKaAAC9bHrEf4+OABvi3+bTsLe9iZnmusrOobHAe4fz0ds+68N4AAAUGUlEQVR4nO1ai3LayLalW0IINUhGMhIgZPGQxMOAkGxwYskeZ+I4E7/wnOGM45z8/3fc3Q3YYOOMXXXr3LpVvZJUhJ69er/WbimT4eDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4PhfBclkNFX759NE8qtb/Ffx3ucRYtjuP58mvH5oO3nlneN4K8g7CSqGrtw3NN34hwEJR69SJL6/Zaf4YfOCsk6RZdAlY/Pmkp6V4H85+yr0xwH34jfQehyFosc7VwjgzX298ovJUfq4/9ocSPcd+cWlQvFjNiM+/VaPJ5NJGIbD4dAZThqJUSHL0NBUKT0JndOqaAe5nLMducmKYnayY7+ZoSjXzTzCuFBgJOvG66fKLdSSXzlWDp2m+HynHqCi9bSXKCE8IofgaZg+DIeD6pKhao/p7kDK1BLYQAxwFl78Y+fn8FRaDNny0W75rQSN5m/Aq1vyLYvUux5CZ9lXOWYLuJDdfki4QWhuPzeiVUD70tNPUo5guPn54CxJB4GDcznUWA5Uu0Q4j9EY/KD9wNgNqaEZ1eHHguPQjcnSg8TyPULpL3LC+sDK83uv8alY1H4fB19bqS/vT6Zdw9XUl+eSygieMtrmxkSUOhiFtU0jErkLZlqLbbXsUVPEsiAItapu4hxG0zJ7ljFgtJIKbFfLdnZvD8LucyFP98awDb8lSV/eSokdJ3/8ylxvwup7KCpenJtddzwY7Ryen3eK8RWO7oRtlUOewOOirW5KsiHOoUFtkzbsROjmaacqmYwhHSjJiPoxhos+WJQhTAYFMwxZJUppwbD4PPalFr1w3f9fg+GHqGOMx53bniinZ59IPLiYjqUxGl5u8dRKiQ2iVNlyJ+sGoiQXbUyrCBHlIBw8Bcw6Q+AhXCLwU1OisynvPDF8YvIaw908WL9R/keG9vUQjytfuiVJETLyuQcRI9jJxdSdI6cuqc8dVffo8/Ke/vJOpDqlPrY5QFL1WDytGb1MU7YTL0estY/hZ6iRJ4alNzAkxohmq6f7vAo5KeCg0mnVZSjWxP5aoHOp+eqo02/h3MB4xlDpYcYQv5hSgMWSJPZ0snEBHQdeG/UmQwK5GeAr72JIxL0JpgxxS8r8EsYZJCf9onvt05kn8SiCgFEqI/mo+0f2GNLaM0ctf0OMIfr2Mk8L9WVyv1wbjN5gO1HwNJBnNqwwWr7wLoZibbaoJvnCRti/hNyiAzJ8xUi0omh19kaBTuozXzg68t3L3EaahxByNbjvJEcfqbnPHbjcQHl26KT6aETlLgehCYYdZh/3bTJUKzS9DLV32rAKvn1Fwx6NZPKrUJQaqKET5Xff8pOB3r2Wb1DXvzlTSe9WEKUAmRvxpoJH4ZMSM2NLfs7Q+IhzHp1Y7D+ORupAnc3nnPVhP/fSgBa5auZdDJVriO3KEIopDrO/6ATAiSJUF5SMcCiepbPSyFB+H+7+Xoov/DND1dw+2t1gqGmFHEqbNNxQQXl2XyHFufATG+J9c7UzC+W6H0IVR9+k1Uw/s2GVlp+xLL6LYfMbQtODMU3DKK29bkMi2ijaE3sVzT/z09ukBLTC4Yej9PJMVYWiql851+s3tg8xjrLynI3jcLMmiuCkqPVvEx6KhyvhCvIAe59ZKhlqyxmhmgZ+qqweiqQGOggXmpl35VKlP8T4OhOztHdc/ZWKnqEfklI/E9P64Og28ojdn6IwOZr7F2pSEu0uStZTTTOEgm4TbUhzZthcv5NI9LyDPlk95ORzK+FKZBBoqXSzqHK1lwxF+OWB3lxyejNDeYyhhKrlBxYU178oGMYO1G6iiBf12dEIfMlMPgWQS8a99PIwhgMltLNmKSEF57dE0e6wdLpZmK2U2lfMetjJYWfBHq7HYVWUqVvjlfgk+pKhogi1ctuEQSYgRN/lpXtDjI5ETSmy8xsbc70BYrcgk7pCr1ccfGCJPuignIPx4VGp+MGwrHi9jSCsfNgicV2Ud3KgCde8Q6yeIDodMAt0QF0WV1mQBzu2CE/JIeyseuuFDbXr63p62IAcdHwnLwPpjQypNobZ1DTC5BF2Pr1qRGqkuDi49YsDH+LdCZ3oCoGMxOHloBeXBjPFefJS2q3goW7IFXlviqEnQP6aJlTAdZm7LPJQKBCa8DDwUtiFUPRXt1owtOaQ6+HEoC4p5H0MQRtjlLQrlUr5A9MYr1d9UAamL1jxLLlN0cmXP09/BMHYHE0f8Nd0UOoLgnv1dK0I1R5H43EL0ICJw1D1nxiC/MQRTbwy6w9Y/EqQ8ALqgNkJ+Edu5aYLhmSPdhV4/Fkg4uo2b2RItXHuBx1HC+IR5fLDvdcYauBTseL6yawYoB+4gU3HOcEnqIOOe/W0Jyhabv5oQyXOLXtWCtqq5dY0YdlEuEs7bs0Iqb9HZU0TwHQLvTmmroslQksokRYMhQxtOtDtWiP2Robg/M5qIOAl6JVujjGsjNFl8fLy+qZ49fdPLz+BZ+96OW9yHF7Xi9fXRR93HuMQupV8PtxlCHfxM00oQvW9tGBDNbpUh+JUMcYgD5hGBXelGjKx1hkSm7Upw/6TI7yNIdwtj8PVSBjX0HiFoWp10a1fn81mfjT520QmTTYmOg69oT9LZ7ObEpTix8cXMPqwWg06iJgmfDwoJKBLGF9VKw/pmoOn09WKmcAKXTai44D8zoa8ZChKP+g0eU/d1tsYQrSgb5+XK1l7f2655AmiVUcdvVjqXpxNvZH5YDai0DTN0z9+Ns4OD1MfTJwsL6XdCnBYKjWxNoDKDppwNXfQqtOsuRhni/U1nxJaPhaHbdbaOio9gVQpw5A2uAcelV3j6mox4S0M1YwLzn+nLC0v9qmX4smWbm7BsIzCg07Q2e90OkG3+2f36urP8Xge0N+AbISWEpO26gidWauuX2wyTRgtNKFIJHBMbZVaCfPJE0h4q37fuqR7Fj+pDACGLk22cQGDPuhZ72FInd/UV+lXte9pRgDt+QpFqktLJrWbeTrttA5Nb9TpTE0GLwFdKq2MBsX7o/64ckMgedA1pNJCExoD8DZ9lROrHeqTkA12rdVzJNoHL3T8GkPoTunoQuUdDDVlF7RxZRW8mtinNnxczHoB6C3Mg0OaeffZ31ar81cySOu9r/utw4MGOm0vGVWh2q/rm4yazz1qQkZg8Jh1SZxnZYrKgyVDeweY5B2qV1cM6SGxeQ8Thc3yomK8haE9eHJ+Bt1kQeGSLetm9J5/YlT3R4cUZ/PDw/nZ4CuEFHZOLg5vik+NK+1W8Ea+KgcsYTNNaN0NsfP0AE06oTbMocrKb0UrQ02OD40nhsvbhHStbSSRtzKkimK+3vUKJcbwh729wxCgxw/1LjUgdcxpq3vCZv84bbU+T9Cj2ZpQ46ft9StXmpBVechCp0+xrmZ8ZsPp0+qwCIoPSsix/syGROix590xUm9guNTG6yfoLFEP1W1vXEjNlesF3PjX+GoMoguH+NxrdLvdr+PGVedzgIf1qiXImkgUyBTY37gFaZ9AdsnhT6C5mjDmZH1ewXPg0LrQgnJCZ7pPNLqck8+Fq6XK6ojGc1h7U4+vadkJTdobLJSEKazuFumm3HRuRaEfov3PxWnjNNo9fwggpzL0oL3c9WWhPjBloPCQx61NNxAtFXr6PDppitYM0vWGqhDqYJjN9YHyMZ3pQBIVdQhT07CXXq3JHZiNpS/8E0OVCvvw2QKiJjfofBa22FBIh3e3VkYLUSPrp/O/bufdBc7P/IMODkFZq/VOqIsCCNyTNtlcIBatuweaxW6EqomGd+7GY5sw1enmGpFI1xqdWFOoC3uatnpXobUT2uXTJmY7w8WS09KGIQp9ZZOhqlW7QzZ7LxjKXTRsZSWhcorC+sF/WkuMd+Z6MUTHsizrpRA7vlibt4pbejChLafd1rwmBIPms/4Fwn9ibyY3ItX+Gu/XBXK5v9PbWDUWstpgHPgkY32AajxuXW6kNHe0s7Mz/tOnO636fqJvaZXkbHFnHLw0oh5OJoVoXHT/nY690+JetdcFekeVPb8x+Z4euPXzKJw84K6RqRnilkwFXYNSqdSgzXyxAk7kcGQ8fykgVio2lAVLtp9ZgSiCYYCqEAW7YlTszUQiKjVjtVMkdm3ruhNR4JyXu8tmOJ4ceyj0Rs06Qn+3kr4l9P9q0byh302GKO+ZjbDQo/3b1tethICzwRPFF0eJcqaRF689iEj/vJgruFhVVUJnTIQNcfPdNTyC7lxcJcKztlYFGMm2EdbMfGROQLu2qnI/KCw6EoyGDd9w4xA/jM0JvkqqRDQE9n5f1VxNAClKBNm2BU0zqF+osMdmK+UsX2sqjSJNWcaSqtiL9/6uqLmyqim2bdRg1EJNY8MyFqOjZ1bsmqGoEFWSJMuGpsqGIcO5ECxSFfZkFIvdh7kGWakrV6U7NdHd5mQZpWT91okKkQOBLymymzYKkAsaiVq1qto3lIs+RvtfD+qfxFp3zOyhzBI5GcuilDQa3zqVeEpXt63v3d49la/i7Fymq8ZjA3LYfMnQTYOYOpjij+R64FbmQSPYL9rC131fIBm32BEgpY8r9AV5sH9/P6i4/SC4B9R6P+7vv92PP8D2Phy5r4++gwhULqf0RbrRWS6suwFrSmsdaZtthVJ6qOvX0CeHeNprVrMHzZ2xdZDVs8WOU4iwd5kt10dpXbFuUIfeyApjG1+V7XsvTeeJRfImpK8+uq+yNzXlkwL02koKO3UzXMm9OOfR1V7dS3Uv35ZMNEtHTkv3Hbq8qH1MhYy07ygko/SR2Ut3PdFF5tnhPJVTdJ/M5yC4BokzTAaHcYBA9ElTTK3nLntTyGg0ybo3cGwLQ+Pch+bIqKOTBzMMneOgS1/LdgPPQUPz/hh14Cak+HtJyWQnSIUGan5v13Jmu4+aslBTiJIzyxnlDnUOprSXjx3otTOSmbrAGq/EsRSgek3TriOp6hWy5QY6EKQ6yLQPyJOy3o6kaXIOdQ0CCjooGyU0yKIgWxEEKKk7VcEA1WMchIUDQ5BatNFpN3IafeuKHVq9RLpmX4bWpoHG2973Ed9V2DyEkdkJHibRrgPdsxd5ky9Tc7g7kKlrMm8DRQLOmQ2LGWCo+yggMuQDN2c2BQtG1kzR91ql0w1DWdF2Da3a+O54iwZHtGJkNtVq48wqLxju0YY41KVzNJ57kqYaO50CXZnvo28y9KvzJjC1CAGGc3mR4LIhfa0ObecnS2g2sEZEPexCbwrRp0cedi0xjsK/t360oLL8QYTq2bEThsfTxpcfD40vpnkSOtGOayxeHrKH2LuFvVp6LKnAsCw/IKcDoe8WzL7vF3GnKoQTqR1Wuui2PQC1ooX/aiybVFFsmvhS6Yc6qT4yBLu64Ld0RU5VjVA/p+oAZuqgbTqqhIK+3xeBYbfvxzSvrhjinu/3TexC/93YK0S2JlqpWUctyd4fjV++Ql1A1BiEqjIPovCj4xRQGIWNbj8rLw8tvjuSvoP7XNUVasNyJjsKER7ZlcLQ8648YCjdo7v5flN3os9XdVEem4Nz/LCMRBhqsNcZy0BpjaFGlDpTIWISJiN8XLViZ9eMTjTLQLued2rAZZMrr0OXUh8ZwsO8sKBmqlE3MaFJVCEkdG+olT9m+q8sKSqCKzC4gt3WhTj2/VgVDg4rUGctd3GAmUIhTuRHOlkwzNSU+UdUt7F5IJVdHFStHvoaqSKESn1XUIVw/z6I8GqJCXS5FGqZNYZ6A7Vpc0KVWvkquA+uULHSx8Fe1SaWDLas2ir10r0qfW+7YvgF98vSAXipMguDb/voqgkiTrISNIL8oIdhewu/6ySdzwcMc9jIkP/AVikZDLpqPIBtemw+Y426HOCftMddMITYVvFcyptVVY1RUBX3CkOzTSAfDgMZ3GFPLqdoNalGgjxqrTWGBbMsLhgKdW/PlmJQxn3cMGjVBoZtKPI00wgiq++PcehnVBkY6mbalvcaMCu3pg3ZIQw10Rij3ks3FZLOSa/+5XSadE7Pxkenqnv21etOxxc/fmriRacRlC6Ch+ScJSmiLVY0XGAFTg2K1fEt56pMP5GCnCvv4x7kpPYUFa1s6MOw9naHj295dzHdA5mmDX3mZ7kdOHcKXRSkrnuVKrTbyvcJ/kadNmOjHwdS1c5QG0oSbVn0j8P2giFUC9Nxr8My608bByYUG2OAaEov0mFsYbjrDgb11uAs6kEplmqdw64fnabfA9v6MOqMB0HrtPEHy6ZEN8+p/nCHJ1IceebP6Mjo5+haoxs2pIwwm5SZV4RZJW3QYQlpbrRY19CMMVtHBJHYbj/gh4ZnXgr0XAcu9z0q0IWeE/SpAIag13D4c+KZ5VIu/BlFHYO2uPQ9lxxQVze6Oa3BFgAhmP0J3bAKM/iv+jDcEohaktQ7F1GdFJN41j6sqHHx1nXrfu93RZgnSaq6v9WKR2wJMKP0fKat4lhU/cuiX1U0laUvolF5ofbYPCgfBOIbLEUL8dJtQKDORJqx4liz4rtiUa0uFr9jqLGXGXayovbUInUWEJ79fgx/VDgdtti3efEdXZgrMoFW8dVLgV0u+8WY6bgSa6zk4rbPfwTBUg9nULsFqHuzI9iAk+lrL8g0fUGg1TC+6C+jdqFs2Rq2orDBr75OWttea+3IU1wslySX166P4OmN/6++0SRrA1i76+YzX7veMoSFoiPK1m8ZX9n9/whUk6/eP28/4b/93S8HBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwfH/xX+B7GURExzpKN1AAAAAElFTkSuQmCC"
          alt="Logo"
          className="logo"
        />

        {/* Team Members' Names (Bottom Right) - Visible on All Pages */}
        <div className="team-names">
          <p>P. Harini & S. Pavani</p>
          </div>
        </div>
      </BrowserRouter>

  
  );
}

export default App;


import React, { useState} from 'react'

const Login = ({login=null,handleUserChange=null,handlePassChange=null,error=""}) => {
    const [type, setType] = useState("password")
    const handleCheckboxChange = e => {
        var checked = e.target.checked;
        if(checked){
            setType("text");
        }
        else{
            setType("password");
        }
    }
    return (
        <div>
            <div className="login">
            <h1>Login to Library</h1>
            <form method="post" onSubmit={login} action="">
                <p><input onChange={handleUserChange} type="text" name="login" placeholder="Username or Email"/></p>
                <p><input onChange={handlePassChange} type={type} name="password" placeholder="Password"/></p>
                <p className="remember_me">
                <label>
                    <input type="checkbox" onChange={handleCheckboxChange} name="remember_me" id="remember_me"/>
                    Show Password
                </label>
                </p>
                <p className="submit"><input type="submit" name="commit" value="Login"/></p>
            </form>
            <div className="login-help">
            {error}
            </div>
            </div>
            
        </div>
    )
}

export default Login

import axios from "axios";
import { useState } from "react";
import {Input} from "@heroui/input";
import { useNavigate } from "react-router";
import {Button, ButtonGroup} from "@heroui/button";
import { Icon } from '@iconify-icon/react';

import Logo from '../../assets/logo.png'

import classes from './AdminLogin.module.css'

const AdminLogin = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        console.log(isVisible);
    };
    const signIn = async () => {
        try{
            const response = await axios.post('http://localhost:3000/adminlogin', {username, password});
            if(response.data.success){
                localStorage.setItem("userDetails", JSON.stringify(response.data.data));
                navigate('/admin');
            }else{
                alert("Invalid credentials");
            }

        }catch(error){
            alert('Error during login');
            console.log('Error during login:', error);
        }
    }
    return(
        <div className={classes['login-container']}>
            <div>
                <div className={classes['bg-sphere-1']}></div>
                <div className={classes['bg-sphere-2']}></div>
                <img src={Logo} alt="Logo" className={classes['logo']}/>
            </div>
            <div className={classes['login-form']}>
                <div className={classes['login-form-header']}>
                    LOGIN
                </div>
                <div className={classes['login-form-body']}>
                    <Input
                        size="md"
                        radius="sm"
                        placeholder="Username"
                        startContent={
                            <Icon icon="material-symbols:person" className="w-5 text-default-400 pointer-events-none flex-shrink-0"/>
                        }
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        classNames={{
                            inputWrapper: classes['input-wrapper'],
                            input: classes['input'],
                        }}
                    />
                    <Input
                        type={isVisible ? "text" : "password"}
                        size="md"
                        radius="sm"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        startContent={
                            <Icon icon="material-symbols:lock" className="w-5 text-default-400 pointer-events-none flex-shrink-0"/>
                        }
                        endContent={
                            <button
                              aria-label="toggle password visibility"
                              className="focus:outline-none flex items-center"
                              onClick={toggleVisibility}
                            >
                              {isVisible ? (
                                <Icon icon="mynaui:eye-slash-solid" width={20} className="w-4 text-default-400 pointer-events-none"/>
                              ) : (
                                <Icon icon="mynaui:eye-solid" width={20} className="w-4 text-default-400 pointer-events-none"/>
                              )}
                            </button>
                        }
                        classNames={{
                            inputWrapper: classes['input-wrapper'],
                            input: classes['input'],
                        }}
                    />
                    <Button color="primary" className="text-white mt-5 rounded-md" onPress={signIn}>Login</Button>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin;
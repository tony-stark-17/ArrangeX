import { useState } from "react";
import {Input} from "@heroui/input";
import {Button, ButtonGroup} from "@heroui/button";
import { Icon } from '@iconify-icon/react';

import Logo from '../../assets/logo.png'

import classes from './AdminLogin.module.css'

const AdminLogin = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        console.log(isVisible);
    };
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
                        classNames={{
                            inputWrapper: classes['input-wrapper'],
                            input: classes['input'],
                        }}
                    />
                    <Input
                        type={isVisible ? "text" : "password"}
                        size="md"
                        radius="sm"
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
                    <Button color="primary" className="text-white mt-5" radius="sm">Login</Button>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin;
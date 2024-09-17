import React from "react"
import {Text, Input, Button} from "@nextui-org/react"
import {FaGithub, FaLinkedin, FaGooglePlay, FaApple} from "react-icons/fa"
import { Link } from "react-router-dom"

export const Footer = () => {
    return (
        <div className="footer">
            <div className="footer_text_div">
            <p className="footer_text">Subscribe for Alacart Mails</p>
            <p className="footer_text">Experience the alacart mobile app</p>
            </div>
             <div className="footer_content">
                <div className="footer_content">
                <input type="email" placeholder="Please Enter valid mail id"/>
                <button className="subscribe_btn">Subscribe Now</button>
                </div>
                <div  className="footer_content">
                    <Text className="footer_text">Stay connected</Text>
                    <div className="social_links">
                    <a href="https://github.com/codewithsakshi" target="_blank"><FaGithub className="icon"/></a>
                    <a href="https://www.linkedin.com/in/sakshimittal01" target="_blank"><FaLinkedin className="icon" target="_blank"/></a>
                    </div>
                </div>
                <div>
                    <div className="footer_content">
                        <button className="icon_btn">
                            <FaApple className="btn_icon"></FaApple>
                            <span>
                                <span>Download on the</span>
                                <br/>
                                <span>App Store</span>
                            </span>
                        </button>
                        <button  className="icon_btn">
                            <FaGooglePlay  className="btn_icon"></FaGooglePlay>
                            <span>
                                <span>Get it on</span>
                                <br/>
                                <span>Google play</span>
                            </span>
                        </button>
                    </div>
                </div>
                </div>
                </div>
    )
} 
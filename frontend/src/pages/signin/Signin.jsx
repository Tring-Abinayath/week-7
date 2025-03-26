import './Signin.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify'
import { useLazyQuery, useMutation } from '@apollo/client'
import lms_logo from '../../assets/tring_lms_logo.png';
import { GET_USERS } from '../../graphql/queries/queries.js';
import { SIGNIN_MUTATION } from '../../graphql/mutations/mutations.js';

function Signin() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const [signinMutation] = useMutation(SIGNIN_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: async (data) => {
            localStorage.setItem('token', data.signin.token)
            await getUsers()
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })

    const [getUsers] = useLazyQuery(GET_USERS, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log("Data:",data)
            if (data.getUsers[0].role === 'admin') {
                navigate('/AdminDashboard')
            } else {
                navigate('/UserDashboard')
            }
        },
        onError: (err) => {
            console.log("Error in getUsers:",err)
        }
    })

    const signin = async (values) => {
        try {
            await signinMutation({
                variables: {
                    email: values.email,
                    password: values.password
                }
            })
        } catch(err) {
            console.log("Error in signin:",err)
        }
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    return (
        <>
            <div className="container">
                <div className="signin-container">
                    <img src={lms_logo} width="210px"></img>

                    <form onSubmit={handleSubmit(signin)}>

                        <input
                            type="text"
                            placeholder="Enter your email"
                            name="email"
                            {...register("email", {
                                required: {
                                    value: true, message: "Email is required"
                                }, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Enter valid email" }
                            })}
                        />
                        {errors.email && <span className='errors'>{errors.email.message}</span>}

                        <div className='passwordField'>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Enter your password"
                                name="password"
                                {...register("password", {
                                    required: {
                                        value: true, message: "Password is required"
                                    }
                                })}
                            />
                            <span onClick={togglePasswordVisibility} className="eye-icon">
                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.password && <span className='errors'>{errors.password.message}</span>}

                        <input type="submit" className='signin_btn' value="Sign In" />
                    
                    </form>
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
            </div>
        </>
    )
}

export default Signin
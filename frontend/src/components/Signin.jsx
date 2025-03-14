import './Signin.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import lms_logo from '../assets/tring_lms_logo.png';

const SIGNIN_MUTATION = gql`
    mutation signin($email:String!,$password:String!){
        signin(email:$email,password:$password){
            token   
            #email
        }
    }
`;

const GET_USERS_QUERY = gql`
    query{
        getUsers {
            user_id
            user_name
            email
            role
        }
    }
`;



function Signin() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null)

    const [signinMutation] = useMutation(SIGNIN_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: async (data) => {
            localStorage.setItem('token', data.signin.token)
            await getUsers()
        },
        onError: (err) => {
            setError(err.message)
            toast.error(err.message)
        }
    })

    const [getUsers] = useLazyQuery(GET_USERS_QUERY, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            if (data.getUsers[0].role === 'admin') {
                navigate('/AdminDashboard')
            } else {
                navigate('/UserDashboard')
            }
        },
        onError: (err) => {
            setError(err.message)
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
            throw new Error("Error during GrahSQL request", err)
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
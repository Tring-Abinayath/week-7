import './Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import lms_logo from '../assets/tring_lms_logo.png';


const SIGNUP_MUTATION = gql`
    mutation signup($createUserInput:CreateUserInput!){
        signup(createUserInput:$createUserInput)
    }
`;


function Signup() {

    const [error, setError] = useState(null)

    const navigate = useNavigate();

    const [signupMutation] = useMutation(SIGNUP_MUTATION, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log("On completed data:", data)
            toast.success('User Created Successfully')
            navigate('/')
        },
        onError: (err) => {
            console.log("On Error:", err)
            setError(err.message)
            toast.error(err.message)
        }
    })

    const signup = async (values) => {

        console.log("After signup")
        console.log("Values:", values)
        console.log("After clicking submit")

        try {
            await signupMutation({
                variables: {
                    createUserInput: {
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        age: parseInt(values.age),
                        phone_number: values.phone
                    }
                }
            });
        } catch (error) {
            console.error('Error during GraphQL request', error);
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

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
            {/* <Header /> */}

            <div className='container'>

                <div className="signup-container">

                    {error &&
                        <span className='existUser'>{error}</span>
                    }

                    {/* <h1 id='signup'>Sign Up</h1> */}
                    <img src={lms_logo} width="210px"></img>
                    <form onSubmit={handleSubmit(signup)}>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            {...register("name", {
                                required: {
                                    value: true, message: "Name is required"
                                }, pattern: { value: /^[A-Za-z\s]+$/, message: "Enter valid name" }
                            })}
                        />
                        {errors.name && <span className='error'>{errors.name.message}</span>}

                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: {
                                    value: true, message: "Email is required"
                                }, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Enter valid email" }
                            })}
                        />
                        {errors.email && <span className='error'>{errors.email.message}</span>}

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
                            {errors.password && <span className='error'>{errors.password.message}</span>}

                        </div>

                        <input
                            type="number"
                            placeholder="Enter your age"
                            name="age"
                            {...register("age", {
                                min: { value: 0, message: "Age must be greater than 0" }, max: { value: 100, message: "Age must be less than 100" }, required: {
                                    value: true, message: "Age is required"
                                }
                            })}
                        />
                        {errors.age && <span className='error'>{errors.age.message}</span>}

                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            name="phone"
                            {...register("phone", {
                                maxLength: { value: 10, message: "Phone number must be of length 10" }, pattern: { value: /^[7-9]\d{9}$/, message: "Phone number must be 10 digits" }, required: {
                                    value: true, message: "Phone number is required"
                                }
                            })}
                        />
                        {errors.phone && <span className='error'>{errors.phone.message}</span>}

                        <input type="submit" className='signup_btn' value="Sign up" />
                    </form>
                    <p>Already have an account? <a href="/">Sign in</a></p>
                </div>
            </div>

        </>
    )
}

export default Signup
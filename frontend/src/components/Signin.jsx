import Header from './Headers.jsx';
import './Signin.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import { gql, useLazyQuery, useMutation } from '@apollo/client'

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
        onCompleted:async (data) => {
            console.log(data)
            localStorage.setItem('token', data.signin.token)
            await getUsers()
        },
        onError: (err) => {
            console.log("On Error:", err)
            setError(err.message)
        }
    })

    const [getUsers] = useLazyQuery(GET_USERS_QUERY, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log("GetUser Data:",data)
            console.log("Data getUser role",data.getUsers[0].role)
            if(data.getUsers[0].role==='admin'){
                navigate('/AdminDashboard')
            }else{
                navigate('/UserDashboard')

            }
        },
        onError: (err) => {
            console.log("On Error:", err)
            setError(err.message)
        }
    })

    const signin = async (values) => {

        localStorage.setItem('isLoggedIn',true)
        console.log("isLogin after signin",localStorage.getItem('isLoggedIn'))

        console.log("values:", values)

        try {
            await signinMutation({
                variables: {
                    email: values.email,
                    password: values.password
                }
            })
        } catch {
            console.log("Error during GrahSQL request", err)
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

            <Header />

            <div className="signin-containter">

                <h1 id='signin'>Sign In</h1>



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
                    {errors.email && <span className='error'>{errors.email.message}</span>}
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
                    {errors.password && <span className='error'>{errors.password.message}</span>}

                    <span onClick={togglePasswordVisibility} className="eye-icon">
                        {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                    </span>

                    <input type="submit" className='signin_btn' value="Sign In" />


                </form>

            </div>

            {error &&
                <span className='incorrectUser'>{error}</span>
            }

        </>
    )
}

export default Signin
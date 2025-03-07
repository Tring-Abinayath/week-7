import { useEffect,useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client'
import './UserDashboard.css'

const GET_USERS = gql`
    query{
        getUsers{
            user_id
            user_name
            email
        }
    }
`;

function UserDashboard() {

    const userEmail = localStorage.getItem('userEmail');
    const [user, setUser] = useState(null);


    const [getUsersQuery] = useLazyQuery(GET_USERS, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log("Data:", data)
            const foundUser = data?.getUsers?.find(u => u.email === userEmail);
            if (foundUser) {
                setUser(foundUser); // Set the user state
                console.log("Signed User:", foundUser);
            }
        },
        onError: (err) => {
            console.log("Errr:", err.message)
        }
    })

    useEffect(() => {
        getUsersQuery()
    }, [])

    if (!user) {
        return <p>Loading user...</p>;
      }

    return (
        <>
        <div className='user'>
            <h1>HI {user.user_name},</h1>
            <h1>Welcome to Tring Courses</h1>
        </div>
        </>
    )
}

export default UserDashboard;
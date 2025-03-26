import { useEffect, useState } from 'react';
import { useLazyQuery, gql, useMutation } from '@apollo/client';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import { MdExitToApp } from 'react-icons/md';
import lms_logo from '../../assets/tring_lms_logo.png'
import { GET_USERS,GET_COURSES,GET_USER_COURSES } from '../../graphql/queries/queries.js';
import { ADD_USER_COURSES } from '../../graphql/mutations/mutations.js';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('courseList');
    const [courses, setCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [yourCourses, setYourCourses] = useState([]);

    const navigate = useNavigate();

    const [getUsersQuery] = useLazyQuery(GET_USERS, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('Data:', data);
            console.log(data.getUsers[0].user_name)
            setUser(data.getUsers[0].user_name);
        },
        onError: (err) => {
            console.log('Errr:', err.message);
        }
    });



    const [getCoursesQuery] = useLazyQuery(GET_COURSES, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('Courses Data:', data);
            const allCourses = data?.getCourses || [];
            setCourses(allCourses)
        },
        onError: (err) => {
            console.log('Errr:', err.message);
        }
    });

    const [addUsersCoursesMutation] = useMutation(ADD_USER_COURSES, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('Data:', data);
        },
        onError: (err) => {
            console.log('Errr:', err.message);
        }
    });

    const [getUserCoursesQuery] = useLazyQuery(GET_USER_COURSES, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('Data---:', data);
            const enrolledCourse = data?.getUserCourses || [];

            setYourCourses(enrolledCourse)

            console.log("Enrolled COurses----:", data?.getUserCourses || [])

        },
        onError: (err) => {
            console.log('Errr:', err.message);
        }
    });


    useEffect(() => {
        getUsersQuery();
        getCoursesQuery();
        getUserCoursesQuery();
    }, []);

    const handleEnroll = async (course) => {

        setYourCourses([...yourCourses, course]);
        setCourses(courses.filter(c => c.course_id !== course.course_id))

        try {
            await addUsersCoursesMutation({
                variables: {
                    courseId: course.course_id,
                    courseName: course.course_name
                }
            })
        } catch (error) {
            console.log("Error during addUsersCoursesMutation request", error)
        }

    };

    console.log("your Courses:", yourCourses)

    if (!user) {
        return <p>Loading user...</p>;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <>
            <div className="user">
                <img src={lms_logo} width={"130px"} height={"100px"}></img>
                <div className='userLogout'>
                    <h3> {user}</h3>
                    <button onClick={handleLogout}><MdExitToApp size={20} /></button>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={selectedTab === 'courseList' ? 'active' : ''}
                    onClick={() => setSelectedTab('courseList')}
                >
                    Course List
                </button>
                <button
                    className={selectedTab === 'yourCourses' ? 'active' : ''}
                    onClick={() => setSelectedTab('yourCourses')}
                >
                    Your Courses
                </button>
                <button
                    className={selectedTab === 'completedCourses' ? 'active' : ''}
                    onClick={() => setSelectedTab('completedCourses')}
                >
                    Completed Courses
                </button>

            </div>

            <div className="tab-content">
                {selectedTab === 'courseList' && (
                    <div>
                        {courses.length > 0 ? (
                            <div className="card-container">
                                {courses.map(course => (
                                    <div key={course.course_id} className="course-card">
                                        <h3>{course.course_name}</h3>
                                        <button onClick={() => handleEnroll(course)}>Enroll</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No courses available.</p>
                        )}

                    </div>
                )}

                {selectedTab === 'completedCourses' && (
                    <div>
                        {completedCourses.length > 0 ? (
                            <div className="card-container">
                                {completedCourses.map(course => (
                                    <div key={course.course_id} className="course-card">
                                        <h3>{course.course_name}</h3>
                                        <p>Status: {course.status}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No completed courses.</p>
                        )}
                    </div>
                )}

                {selectedTab === 'yourCourses' && (
                    <div>
                        {yourCourses.length > 0 ? (
                            <div className="card-container">
                                {yourCourses.map(course => (
                                    <div key={course.course_id} className="course-card" onClick={() => navigate(`./Videos/${course.course_id}`)}>
                                        <h3>{course.course_name}</h3>
                                        <p>Status: Enrolled</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No courses enrolled.</p>
                        )}
                    </div>
                )}

            </div>

        </>
    );
}

export default UserDashboard;


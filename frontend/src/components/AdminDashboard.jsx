import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import Headers from './Headers.jsx';
import { useForm } from 'react-hook-form';
import { useMutation, gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const ADD_COURSE = gql`mutation addCourse($courseName:String!){
    addCourse(course_name: $courseName)
  }
`;

const GET_COURSES = gql`
    query {
        getCourses {
            course_id
            course_name
            #status
        }
    }
`;

const EDIT_COURSE = gql`
    mutation editCourse($courseId:Int!,$courseName:String!){
        editCourse(course_id:$courseId,course_name:$courseName)
    }
`;

const DELETE_COURSE = gql`
    mutation deleteCourse($courseId:Int!){
        deleteCourse(course_id:$courseId)
    }
`;

function AdminDashboard() {
    const [addCourseBtn, setAddCourseBtn] = useState(false);
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const navigate=useNavigate();
    const [error,setError]=useState('')

    const [addCourseMutation] = useMutation(ADD_COURSE, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log(data)
            getCoursesQuery()
        },
        onError: (err) => {
            console.log("Error:", err.message)
            setError(err)
        }
    })

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

    const [editCourseMutation] = useMutation(EDIT_COURSE, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log("DATA:", data)
            getCoursesQuery()
        },
        onError: (err) => {
            console.log("Error:", err.message)
        }
    })

    const [deleteCourseMutation] = useMutation(DELETE_COURSE, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            console.log('Courses Data:', data);
            getCoursesQuery()
        },
        onError: (err) => {
            console.log("Error:", err.message)
        }
    })

    const handleAddCourse = async (values) => {

        console.log("values", values)
        console.log("editingCOurse:", editingCourse)
        if (editingCourse) {
            try {
                await editCourseMutation({
                    variables: {
                        courseId: editingCourse.course_id,
                        courseName: values.course
                    }
                })
                setEditingCourse(null)
            } catch (error) {
                throw new Error('Error during graphql request', error)
            }
        } else {
            console.log("Values:", values);
            try {
                await addCourseMutation({
                    variables: {
                        courseName: values.course.trim()
                    }
                })
            } catch (error) {
                throw new Error("Error during graphql request", error)
            }

        }
        reset()
        setAddCourseBtn(false)
    };

    const handleEdit = async (course) => {
        setAddCourseBtn(true)
        setEditingCourse(course)
    }

    const handleDelete = async (course) => {
        try {
            await deleteCourseMutation({
                variables: {
                    courseId: course.course_id
                }
            })
        } catch (error) {
            throw new Error('Error during graphql request', error)
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        getCoursesQuery();
    }, []);

    useEffect(() => {

        if (editingCourse) {
            setValue('course', editingCourse.course_name)
        }
    }, [editingCourse])

    return (
        <>
            <Headers />
         
            <div className='addCourse'>
                <button onClick={() => setAddCourseBtn(true)}>+ Add Courses</button>
            </div>
            {error && <p>{error.message}</p>}
            {console.log("Error:",error)}
            {addCourseBtn && (
                <div>
                    <form onSubmit={handleSubmit(handleAddCourse)}>
                        <input
                            id='addCourseInput'
                            type="text"
                            name="course"
                            placeholder="Add a course"
                            {...register("course", {
                                required: {
                                    value: true, message: "Course Name is required"
                                }, pattern: { value: /^[A-Za-z\s]+$/, message: "Enter valid course name(String)" }
                            })}
                        />
                        {editingCourse ? (
                            <button className='addbtn'>Update</button>
                        ) : (
                            <button className='addbtn'>Add</button>
                        )}


                        {errors.course && <span className='error'>{errors.course.message}</span>}
                    </form>

                </div>

            )}
            
            <div>
                <h1>Course List</h1>
                {courses.length > 0 ? (
                    <div className='cards'>

                        <div className="card-container">
                            {courses.map(course => (
                                <div key={course.course_id} className="course-card" >
                                    <h3 onClick={()=>navigate(`/AdminDashboard/VideoUpload/${course.course_id}`)}>{course.course_name}</h3>
                                    <div id='cardBtn'>
                                        <button onClick={() => handleEdit(course)}>Edit</button>
                                        <button onClick={() => handleDelete(course)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>No courses available.</p>
                )}
            </div>
        </>
    );
}

export default AdminDashboard;

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider';
import { Table } from 'flowbite-react';
import useUser from '../../hooks/useUser';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const [allUsers,setAllUsers] = useState([]);
    const [username, setUsername] = useState('');
    const user = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [indexOfFirstBook,setIndexOfFirstBook] = useState(null);
    const [currentUsers,setCurrentUsers] = useState([]);
    const token = localStorage.getItem('access-token');
    const [userData,refetch] = useUser();
    const navigate = useNavigate()

    const setItemsDetails = (x) => {
      setCurrentUsers(x);
    }
    const setIndexBook = (y) => {
      setIndexOfFirstBook(y);
    }  
  
    useEffect (() => {
      fetch("https://book-store-api-theta.vercel.app/admin/all-users",{
        method: "GET",
        headers: {
          "Content-Type" : "application/json",
          "authorization": `Bearer ${token}`
        }})
      .then(res => res.json())
      .then(data => setAllUsers(data));
      setIsLoading(false);
      
      if(userData && userData.username){
        setUsername(userData.username)
      }
    }, [user,userData,token,currentUsers]);

    if(isLoading){
      return <div className="flex items-center justify-center h-screen">
      <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
          </div>
      </div>
  </div>
    }
  
  const handleDeleteUser = (id,name) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user ?");
    if (isConfirmed) {
      fetch(`https://book-store-api-theta.vercel.app/user/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          },
        }
      )
      .then(res => res.json())
      .then(data => {
        if (data.deletedCount === 1) {
          alert(`Deleted '${name}'`);
          refetch();
          setAllUsers(allUsers.filter(prev => prev.username !== name));
        } else {
          alert(`Failed to delete the ${name}.`);
        }
      })
      .catch(error => {
        console.error("Error deleting book:", error);
      });
    }
  }


  const handleMakeAdmin = (id,userrole,userInfo) => {
    const updateUserObj = {role : userrole=='user' ? 'admin' : "user"};
    const isConfirmed = window.confirm("Are you sure , you want to make this user as admin ?");
    if (isConfirmed) {
      fetch(`https://book-store-api-theta.vercel.app/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", 
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateUserObj)
      }).then(res => res.json()).then(data => {
        alert(`The ${userInfo.username}'s role has been updated to ${updateUserObj.role}!`);

        setCurrentUsers(prev => {prev.map(item => {
          if(item.id === id) {
            return [...item,item.role === updateUserObj.role]
          }
          return item;
        })})
        refetch()
      })
      .catch(error => {
        console.error('Error updating book:', error);
      });
      
    }
  }

  const handleRemoveAdmin = (id,userrole,currentusername,userInfo) => {
    const updateUserObj = {role : userrole=='admin' ? 'user' : "admin"};
    const isConfirmed = window.confirm("Are you sure , you want to remove this user as admin ?");
    if (isConfirmed) {
      fetch(`https://book-store-api-theta.vercel.app/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
    
        },
        body: JSON.stringify(updateUserObj)
      }).then(res => res.json()).then(data => {
        alert(`${userInfo.username} is user now !!!`);
        if(username == currentusername){
          navigate("/")
        }else{
          setCurrentUsers(prev => {prev.map(item => {
            if(item.id === id) {
              return [...item,item.role === updateUserObj.role]
            }
            return item;
          })})
          refetch()
        }
      })
      .catch(error => {
        console.error('Error updating book:', error);
      });
    }
  }
  
  return (
    <div className='px-4 my-12 '>
      <h2 className='mb-8 text-3xl text-center bg-red-300 font-bold py-1'>Manage Your Users</h2>
      <h2 className='mb-2'>Welcome &nbsp;<b>{username}</b> &nbsp;you can manage a users here !</h2>

      {
        allUsers && Array.isArray(allUsers) && allUsers.length > 10 ?
          (
            <div>
              <div className='overflow-auto'>
                <Table className=' border border-collapse sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px]'>
                  <Table.Head>
                    <Table.HeadCell>No.</Table.HeadCell>
                    <Table.HeadCell>User Name</Table.HeadCell>
                    <Table.HeadCell>Email Address</Table.HeadCell>
                    <Table.HeadCell>Role</Table.HeadCell>
                    <Table.HeadCell>
                      <span className='ml-10'>Edit or Manage</span>
                    </Table.HeadCell>
                  </Table.Head>
                  {
                    currentUsers.map( (userInfo,index) => <Table.Body className='divide-y sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px]' key={userInfo._id}>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 sm:max-w-[760px] md:max-w-[1014px] lg:max-w-[1270px]">
                          <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                            {indexOfFirstBook+index + 1} 
                          </Table.Cell>
                          <Table.Cell className=" font-medium text-gray-900 dark:text-white">
                            {userInfo.username}
                          </Table.Cell>
                          <Table.Cell ><span>{userInfo.email}</span></Table.Cell>
                          <Table.Cell>{userInfo.role}</Table.Cell>
                          <Table.Cell>
                            {
                                userInfo.role == "admin" ?
                                  (<div className='text-center'>
                                    {userInfo.email == "suryanarayanagaddam020@gmail.com" ? 
                                    <button className='bg-green-600 px-4 py-1 font-serif font-semibold text-white rounded hover:bg-blue-500 hover:text-white text-center'>Developer </button>
                                    : (
                                        <button onClick={() => handleRemoveAdmin(userInfo._id,userInfo.role,userInfo.username,userInfo)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-full hover:bg-gray-600 hover:text-red ml-5 text-start'>Remove Admin</button>
                                      ) 
                                    }
                                  </div>
                                )
                                  : ( 
                                    <div>
                                        <button onClick={() => handleMakeAdmin(userInfo._id,userInfo.role,userInfo)} className='bg-blue-600 px-4 py-1 font-semibold text-white rounded-full hover:bg-green-600 ml-5 text-start'>Make Admin</button>
                                      <button onClick={() => handleDeleteUser(userInfo._id,userInfo.username)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-full hover:bg-gray-100 hover:text-red-600 ml-5'>Delete</button>
                                    </div>
                                ) 
                            }

                          </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                  )}
                </Table>
              </div>
              <Pagination setItemsDetails={setItemsDetails} setIndexBook={setIndexBook} itemsPerPage={10} maxPageNumbers={10} inputArrayItems={allUsers}/>
            </div>
          ) : (
            <p className='text-center'> Currently No User Details Available </p>
          )
      }

    </div>
  )
}

export default Users

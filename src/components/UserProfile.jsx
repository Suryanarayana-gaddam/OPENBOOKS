import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { FaPen } from 'react-icons/fa';
import pica from 'pica';
import { useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import Loading from './Loading';

const UserProfile = () => {
    const [username, setUsername] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [isNameChangeClicked, setIsNameChangeClicked] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access-token');
    const fileInputRef = useRef(null);
    const picaInstance = pica();

    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userData,refetch] = useUser();
    const user = useContext(AuthContext);

    useEffect(() => {
        if(userData){
            setUsername(userData.username);
            setProfilePic(userData.profilePic);
            setUserId(userData._id);
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [userData]);

    if(loading){
        return <Loading/>
    }

    const handleLogout = async () => {
        try {
          const isConfirmed = window.confirm("Are you sure, you want to logout ?");
          if (isConfirmed) {
            await logOut();
            localStorage.removeItem('access-token');
    
            alert('Sign-out successful!!!');
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    localStorage.setItem("ProfilePic",reader.result);
                    handleUpdateProfile(); 
                };
                
                reader.readAsDataURL(resizedImage); 
            } catch (error) {
                console.error('Error resizing image:', error);
            }
        }
    };
    
    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const reader = new FileReader();

            reader.onload = (event) => {
                img.src = event.target.result;
            };

            img.onload = () => {
                const width = 300; 
                const scaleFactor = width / img.width;
                const height = img.height * scaleFactor;

                canvas.width = width;
                canvas.height = height;

                picaInstance.resize(img, canvas)
                    .then(result => picaInstance.toBlob(result, 'image/jpeg', 0.90))
                    .then(blob => resolve(blob))
                    .catch(err => reject(err));
            };

            img.onerror = reject;

            reader.readAsDataURL(file);
        });
    };

    const handleUpdateProfile = async () => {
        const updateUserObj = {};
    
        if (newUsername.trim() !== '') {
            updateUserObj.username = newUsername;
        }
            updateUserObj.profilePic = localStorage.getItem("ProfilePic");
            localStorage.removeItem("ProfilePic")


        if (Object.keys(updateUserObj).length === 0) {
            console.log('No changes to update.');
            return;
        }
        try {
            const response = await fetch(`https://book-store-api-theta.vercel.app/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updateUserObj),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update user data');
            }
    
            const updatedData = await response.json();
            console.log('User data updated successfully:', updatedData);
    
            setUsername(updatedData.username); 
            setProfilePic(updatedData.profilePic); 
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
        window.location.reload();
    };
    

    const handleClickEditName = () => {
        setIsNameChangeClicked(true);
        setNewUsername(username); 
    };

    const handleSaveName = () => {
        setIsNameChangeClicked(false);
        handleUpdateProfile();
    };

    if (!user) {
        return <p className="text-center mt-4">No user data available.</p>;
    }

    return (
        <div className="lg:pt-24 pt-16 text-center">
            <h1 className='font-bold text-3xl'>Profile Details :</h1>
            <div className="text-center p-8 max-w-lg mx-auto shadow rounded-lg sm:pr-5 hover:scale-110 duration-300">
                <img
                    className="h-36 w-36 rounded-full ml-32 lg:ml-36 text-center"
                    src={ profilePic || user?.user?.photoURL}
                    alt={`Profile pic of ${username}`} 
                />
                <input
                    type="file"
                    accept=".jpeg, .jpg, .png"
                    onChange={handleFileInputChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="relative bottom-10 left-10 shadow p-2 bg-white rounded-full"
                >
                    <FaPen />
                </button>
                <h1 className=" font-gray">
                    <b>Name : </b>
                    {isNameChangeClicked ? (
                        <span>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                                className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleSaveName}
                                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsNameChangeClicked(false)}
                                className="ml-2 bg-gray-400 hover:bg-red-500 text-white font-bold py-1 px-2 rounded"
                            >
                                Cancel
                            </button>
                        </span>
                    ) : (
                        <span
                            onClick={handleClickEditName}
                            className="cursor-pointer border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                        >
                            {username}
                            <button className=" shadow-lg p-2 relative left-8 rounded-full"><FaPen  /></button>
                        </span>
                    )}
                </h1>
                <p className="text-gray">
                    <b>E-Mail : </b>
                    {userData.email}
                </p>
                <button onClick={handleLogout} className="bg-red-700 px-8 py-2 hover:scale-95 duration-75 text-white rounded mt-6">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserProfile;

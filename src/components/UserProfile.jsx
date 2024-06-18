import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { FaPen } from 'react-icons/fa';
import pica from 'pica';

const UserProfile = () => {
    const [username, setUsername] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [isNameChangeClicked, setIsNameChangeClicked] = useState(false);

    const token = localStorage.getItem('access-token');
    const user = useContext(AuthContext);
    const userEmail = user?.user?.email;

    const fileInputRef = useRef(null);
    const picaInstance = pica();

    useEffect(() => {
        if (userEmail) {
            fetch(`http://localhost:5000/userByEmail/${userEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return res.json();
            })
            .then(userData => {
                setUsername(userData.username);
                setProfilePic(userData.profilePic);
                setUserId(userData._id);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Handle the error (e.g., display a message to the user)
            });
        }
    }, [userEmail,user, token]);

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewProfilePic(reader.result); 
                    console.log(reader.result)
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
        if (newProfilePic) {
            updateUserObj.profilePic = newProfilePic;
        }
        //console.log("Updated User pic :",newProfilePic)
        //console.log("Updated User Object :",updateUserObj)

        if (Object.keys(updateUserObj).length === 0) {
            console.log('No changes to update.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
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
        window.location.reload()
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
        <div className="lg:pt-24 text-center">
            <div className="text-center p-8 max-w-lg mx-auto shadow-lg rounded-lg">
                <img
                    className="h-36 w-36 rounded-full"
                    src={newProfilePic || profilePic}
                    alt={`Profile picture of ${username}`}
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
                <h1 className="text-lg font-gray">
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
                    {userEmail}
                </p>
            </div>
        </div>
    );
};

export default UserProfile;

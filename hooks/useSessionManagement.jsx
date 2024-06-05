import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthProvider';

const useSessionManagement = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = useContext(AuthContext)

  useEffect(() => {

    if(user){
      if(sessionStorage.getItem("session-active") == 'true'){
        navigate('/', { replace: true });
      }else{
        console.log("session is not active")
        logOut();
        navigate('/login', { replace: true });
      }
        const handleNetworkChange = () => {
        if (!navigator.onLine) {
          alert('Network connection lost. Logging out...');
          logOutUser();
        }
      };
  
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          startInactivityTimer();
        } else {
          resetInactivityTimer();
        }
      };
  
      // Log out user
      const logOutUser = async () => {
        await logOut();
        localStorage.removeItem('access-token');
        sessionStorage.setItem('session-active', JSON.stringify(false));
        alert('You have been logged out.');
        navigate('/login', { replace: true });
      };
  
      // Inactivity timer
      let inactivityTimer;
      const startInactivityTimer = () => {
        inactivityTimer = setTimeout(() => {
          alert('You have been inactive for too long. Logging out...');
          logOutUser();
        }, 600000); // 10 minutes of inactivity
      };
  
      const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
      };
  
      // Add event listeners
      window.addEventListener('offline', handleNetworkChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keydown', resetInactivityTimer);
  
      // Clean up event listeners on component unmount
      return () => {
        window.removeEventListener('offline', handleNetworkChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('mousemove', resetInactivityTimer);
        window.removeEventListener('keydown', resetInactivityTimer);
        clearTimeout(inactivityTimer);
      };
    }else{
      sessionStorage.setItem("session-active",'false');
    }
    }, [logOut, navigate,user]);
    
};

export default useSessionManagement;

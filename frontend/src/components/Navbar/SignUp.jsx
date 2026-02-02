import React from 'react'
import { useAppState } from '../../context/Context'

const SignUp = () => {
  const { setSignupActive } = useAppState();
  
  return (
    <button 
      onClick={() => setSignupActive(true)}
      className="rounded-3xl w-[6rem] px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold transform duration-300"
    >
      Sign Up
    </button>
  );
}

export default SignUp
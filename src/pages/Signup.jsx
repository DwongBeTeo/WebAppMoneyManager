import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {assets} from '../assets/asset.js';
import Input from "../components/Input.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../util/apiEndpoints.jsx";
import { LoaderCircle } from "lucide-react";
import { validateEmail } from "../util/Validation.js";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";
const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
        let profileImageUrl = null;
        setIsLoading(true);
        // Handle signup logic here
        if(!fullName || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }else if(!validateEmail(email)){
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }
         setError(null);

        // sign up API call can be placed here
        try {
            //upload profile image if exists
            if(profileImage) {
                const imageUrl = await uploadProfileImage(profileImage);
                profileImageUrl = imageUrl || '';

            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            })
            if(response.status === 201){
                toast.success("Account created successfully! Please login.");
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background image with blur*/}
            <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />

            <div className="relative z-10 w-full max-w-lg px-6">

                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Create an Account
                    </h3>
                    {/* <p className="text-base text-slate-700 text-center m-8"> */}
                    <p className="text-base md:text-lg text-slate-600 text-center mt-6 mb-8 max-w-md mx-auto leading-relaxed">
                        Start tracking your spending by joining with us!
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
                            />

                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                type="email"
                                placeholder="example@gmail.com"
                            />

                            <div className="col-span-2">
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                />
                            </div>

                        </div>
                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button 
                        disabled={isLoading} 
                        className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 text-lg rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                            isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                        type="submit">
                            {isLoading ? (
                                <>
                                 <LoaderCircle className="animate-spin w-5 h-5"/>
                                    Signing Up...
                                </>
                            ) : (
                                'SIGN UP'
                            )}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Already have an account?
                            <Link to="/login" className="font-medium text-primary hover:underline hover:text-primary-dark transition-colors">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;
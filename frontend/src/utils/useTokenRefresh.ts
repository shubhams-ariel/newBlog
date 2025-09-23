// import { useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import authAPI from "../services/api"; 
// import { toast } from "react-toastify";

// interface JwtPayload {
//   exp: number;
// }

// export const useTokenRefresh = () => {
//   useEffect(() => {
//     const checkAndRefreshToken = async () => {
//       const token = localStorage.getItem("accessToken");
//       if (!token) return;

//       try {
//         const decoded: JwtPayload = jwtDecode(token);
//         const currentTime = Math.floor(Date.now() / 1000); 
//         const timeToExpiry = decoded.exp - currentTime;

      
//         if (timeToExpiry < 10) {
//           const refreshRes = await authAPI.post("/refresh", {}, { withCredentials: true });
//           const newAccessToken = refreshRes.data.accessToken;
//           localStorage.setItem("accessToken", newAccessToken);
//           toast.info("Session refreshed", { autoClose: 2000 });
//         }
//       } catch (error) {
//         console.error("Token refresh failed:", error);
//         toast.error("Session expired, please log in again");
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     };

  

    
//   }, []);
// };
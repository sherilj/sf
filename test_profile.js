const axios = require('axios');
const API_BASE_URL = "http://65.1.85.74:8082";

async function run() {
    try {
        console.log("Requesting OTP...");
        const phone = "+919999999999";
        
        await axios.post(`${API_BASE_URL}/api/v1/auth/send-otp`, {
            mobileNumber: phone,
            name: "Test User"
        });
        
        // Use a random OTP code first? Usually test accounts have a fixed OTP or we can't test it.
        // Let's see if 123456 works as it's often a default.
        let verifyRes;
        try {
            verifyRes = await axios.post(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
                mobileNumber: phone,
                otpCode: "123456",
                name: "Test User"
            });
        } catch (err) {
            console.log("Could not auto-verify with 123456:", err.response?.data);
            return;
        }

        const token = verifyRes.data.token || verifyRes.data.user?.token || verifyRes.data.data?.token;
        console.log("Logged in!", token ? "Yes" : "No token");
        if (!token) return;

        console.log("Fetching profile GET...");
        const profileRes = await axios.get(`${API_BASE_URL}/api/v1/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile GET:", profileRes.data);

        console.log("Updating profile PUT...");
        const putRes = await axios.put(`${API_BASE_URL}/api/v1/users/profile`, {
            name: "Updated Name",
            fullName: "Updated FullName",
            email: "test@example.com",
            gender: "male",
            dob: "1990-01-01"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile PUT:", putRes.data);

        const profileRes2 = await axios.get(`${API_BASE_URL}/api/v1/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Profile GET 2:", profileRes2.data);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
run();

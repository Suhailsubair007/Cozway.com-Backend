const User = require('../model/User');

const checkUserBlocked = async (req, res, next) => {
    try {
        const userId = req.user


        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from the request." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                error: "User not found." });
        }

        if (user.is_blocked) {
            return res.status(403).json({ 
                message: "User is blocked." });
        }

        next(); 
    } catch (error) {
        console.error("Error in checkUserBlocked middleware:", error);
        res.status(500).json({ 
            error: "An internal server error occurred." });
    }
};

module.exports = checkUserBlocked;

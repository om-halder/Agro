import User from "../models/User.js";

// GET /api/user/profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by Firebase auth middleware: { uid, email }
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      // Create user if doesn't exist (first time login)
      const newUser = await User.create({
        firebaseUid: req.user.uid,
        email: req.user.email,
        name: req.user.email.split("@")[0], // Default name from email
        role: "farmer",
        location: "",
        phoneNumber: "",
        profileImage: "",
      });
      return res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        phoneNumber: newUser.phoneNumber,
        profileImage: newUser.profileImage,
      });
    }

    // Return user without password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, role, location, phoneNumber, profileImage } = req.body;
    
    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only allowed fields
    if (name !== undefined) user.name = name;
    if (role !== undefined && ["farmer", "expert"].includes(role)) {
      user.role = role;
    }
    if (location !== undefined) user.location = location;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    // Return updated user without password
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
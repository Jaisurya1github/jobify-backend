const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ✅ Only sign here
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}


exports.register = async (req, res) => {
    const { name, email, password, role } = req.body
    try {
        const userExists = await User.findOne({ email })
        if (userExists) return res.status(400).json({ message: 'User already exists' })

        const newUser = await User.create({ name, email, password, role })
        const token = generateToken(newUser)
        res.status(201).json({ user: newUser, token })
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        console.log("Login request:", email, password)
        const user = await User.findOne({ email })

        if (!user) {
            console.log("User not found")
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            console.log("Password mismatch")
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(user)
        res.json({ user, token })

    } catch (err) {
        console.error("Login Error:", err.message)
        res.status(500).json({ message: 'Error logging in', error: err.message })
    }
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()
const jobRoutes = require('./routes/jobRoutes')


const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)


app.get('/', (req, res) => {
    res.send('Jobify backend running 🚀')
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected')
    app.listen(process.env.PORT, () => {
        console.log(`✅ Server running on port ${process.env.PORT}`)
    })
}).catch(err => console.error(err))

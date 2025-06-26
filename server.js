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
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });

}).catch(err => console.error(err))

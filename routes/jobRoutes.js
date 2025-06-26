const express = require('express')
const Job = require('../models/Job')
const protect = require('../middleware/authMiddleware')
const Application = require("../models/Application")
const router = express.Router()

// POST a job (only for logged-in recruiters)
router.post('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Access denied: Only recruiters can post jobs' })
        }

        const job = new Job({
            ...req.body,
            postedBy: req.user._id
        })

        const savedJob = await job.save()
        res.status(201).json(savedJob)
    } catch (err) {
        res.status(500).json({ message: 'Failed to post job', error: err.message })
    }
})

// GET all jobs (public)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name email')
        res.json(jobs)
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch jobs', error: err.message })
    }
})

router.post("/apply/:jobId", protect, async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only jobseekers can apply" })
        }

        const { jobId } = req.params
        const alreadyApplied = await Application.findOne({
            user: req.user._id,
            job: jobId
        })

        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied to this job" })
        }

        const application = await Application.create({
            user: req.user._id,
            job: jobId
        })

        res.status(201).json({ message: "Application submitted", application })
    } catch (err) {
        res.status(500).json({ message: "Failed to apply", error: err.message })
    }
})

router.get("/my-posts", protect, async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters allowed" })
        }

        const jobs = await Job.find({ postedBy: req.user._id })
        res.json(jobs)
    } catch {
        res.status(500).json({ message: "Failed to fetch jobs" })
    }
})

router.get("/applicants/:jobId", protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId)
        if (!job || job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" })
        }

        const applications = await Application.find({ job: req.params.jobId }).populate("user", "name email")
        res.json(applications)
    } catch {
        res.status(500).json({ message: "Could not fetch applicants" })
    }
})

// GET applications submitted by the current user (jobseeker)
router.get("/my-applications", protect, async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({ message: "Only jobseekers can view their applications" })
        }

        const apps = await Application.find({ user: req.user._id }).populate("job")
        res.json(apps)
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch applications", error: err.message })
    }
})


module.exports = router

const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const mongoose = require('mongoose')

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const tickets = await Ticket.aggregate([
    { $match: { user: req.user._id } },
    {
      $addFields: {
        statusPriority: {
          $cond: [{ $eq: ["$status", "new"] }, 0, 1] // new = 0, close = 1
        }
      }
    },
    { $sort: { statusPriority: 1, createdAt: -1 } } // new first, then recent
  ])

  res.status(200).json(tickets)
})

// @desc    Get user ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Check if ticket belongs to user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  res.status(200).json(ticket)
})

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  try {
    const { 
      projectname, 
      sitelocation, 
      projectlocation, 
      fault, 
      issue, 
      description, 
      date, 
      spare, 
      rating 
    } = req.body

    // Get uploaded files from multer
    const imageFiles = req.files
    const imagePaths = imageFiles.map((file) => file.path) // save path to DB

    if (!projectname || !sitelocation || !projectlocation || !fault || !issue || !description || !date || !spare || !rating) {
      res.status(400)
      throw new Error('Please provide all required fields')
    }

    // Get user using the id and JWT
    const user = await User.findById(req.user.id)

    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    // Check if projectname is one of the predefined project collections
    const validProjects = ['jogini', 'solding', 'shong', 'sdllpsalun', 'kuwarsi']
    if (!validProjects.includes(projectname.toLowerCase())) {
      res.status(400)
      throw new Error('Invalid project name')
    }

    // Dynamically fetch spare descriptions based on project name
    const collectionMapping = {
      jogini: 'spareDescription',
      solding: 'descriptionOfMaterial',
      shong: 'descriptionOfMaterial',
      sdllpsalun: 'nameOfMaterials',
      kuwarsi: 'nameOfMaterials'
    }

    const collectionName = collectionMapping[projectname.toLowerCase()]

    const ProjectModel = mongoose.model(projectname.toLowerCase()) // Dynamically get model
    const spareDescriptions = await ProjectModel.find({}) // Fetch spare descriptions from the collection
    const spareDescriptionsList = spareDescriptions.map((item) => item[collectionName])

    // Get the spare used from the provided list
    const isSpareValid = spareDescriptionsList.includes(spare)

    if (!isSpareValid) {
      res.status(400)
      throw new Error('Invalid spare used')
    }

    const images = req.files?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    })) || []

    console.log('Creating new ticket...')
    const ticket = await Ticket.create({
      projectname,
      sitelocation,
      projectlocation,
      fault,
      issue,
      description,
      date,
      spare,
      rating,
      images,
      user: req.user.id,
      status: 'new'
    })
    
    await ticket.save() // ✅ triggers the pre('save') hook and sets ticket_id

    console.log('Ticket created successfully:', ticket)
    res.status(201).json(ticket)
  } catch (error) {
    console.error('Error creating ticket:', error)
    res.status(500).json({
      message: 'Error creating ticket',
      error: error.message
    })
  }
})

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Check if ticket belongs to user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  await ticket.remove()

  res.status(200).json({ success: true })
})

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  // Check if ticket belongs to user
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    }
  )

  res.status(200).json(updatedTicket)
})

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket
}

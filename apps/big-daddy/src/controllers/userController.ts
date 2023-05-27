import prisma from '../clients/prisma';

const userController = {
  getAllUsers: async (req, res) => {
    res.send({ message: 'Wow no users!' });
    // Logic to retrieve all users using the User model
    // Send the response back
  },
  getUserById: async (req, res) => {
    // Logic to retrieve a user by ID using the User model
    // Send the response back
  },
  createUser: async (req, res) => {
    // return prisma.user.create({
    //   data: {
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //   },
    // });
    // Logic to create a new user using the User model
    // Send the response back
  },
  updateUser: async (req, res) => {
    // Logic to update a user by ID using the User model
    // Send the response back
  },
  deleteUser: async (req, res) => {
    // Logic to delete a user by ID using the User model
    // Send the response back
  },
};

export default userController;

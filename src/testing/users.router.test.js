const UsersRouter = require('../router/controllers/users.controller');
const { createUser, getAll, updateUserRole } = require('../services/users.services');
const User = require('../dao/models/Users.model');
const authorization = require('../middlewares/authorization.middleware');
const UserDTO = require('../DTOs/users.dto');

jest.mock('../services/users.services', () => ({
    createUser: jest.fn()
}));

test('should register a new user', async () => {
    try {
        
        const mockUserDTO = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            age: 30,
            password: 'password123'
        };
    
        const mockNewUser = {
            _id: '1234567890',
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            age: 30,
            password: 'password123',
            role: 'User'
        };
    
        createUser.mockResolvedValue(mockNewUser);
    
        const usersRouter = new UsersRouter();
    
        const req = { body: mockUserDTO };
        const res = {
            sendCreatedSuccess: jest.fn(),
            sendServerError: jest.fn()
        };
    
        await usersRouter.handleRoute('/register', 'POST', [authorization['PUBLIC']], req, res);
    
        expect(createUser).toHaveBeenCalled(expect.anything());
        expect(res.sendCreatedSuccess).toHaveBeenCalledWith(mockNewUser);
        expect(res.sendServerError).not.toHaveBeenCalled();
    } catch (error) {
        console.log(error);
    }
}, 1000000);
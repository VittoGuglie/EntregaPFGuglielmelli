const mapEntity = require('./mapEntity')

class EntityDAO {
    constructor(entity) {
        this.entity = mapEntity[entity]
    }

    getAll() {
        try {
            const simplifiedUsers = users.map(user => {
                return {
                    nombre: user.first_name,
                    correo: user.email,
                    tipoCuenta: user.role
                };
            });

            return simplifiedUsers;
        } catch (error) {
            throw error
        }
    }

    async getOne(id) {
        try {
            const user = this.entity.find(user => user.id === id);
            if (!user) {
                throw new Error(`Usuario con ID ${id} no encontrado`);
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async create(newUserInfo) {
        try {
            return await this.entity.create(newUserInfo)
        } catch (error) {
            throw error
        }
    }

    async update(id, updatedInfo) {
        try {
            const index = this.entity.findIndex(user => user.id === id);
            if (index === -1) {
                throw new Error(`Usuario con ID ${id} no encontrado`);
            }

            Object.assign(this.entity[index], updatedInfo);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const index = this.entity.findIndex(user => user.id === id);
            if (index === -1) {
                throw new Error(`Usuario con ID ${id} no encontrado`);
            }

            this.entity.splice(index, 1);
        } catch (error) {
            throw error;
        }
    }

    async deleteInactiveUsers(maxInactiveDays) {
        try {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - maxInactiveDays);
            
            await this.entity.deleteMany({ last_connection: { $lt: currentDate } });
        } catch (error) {
            throw error;
        }
    }

    async updateRole(userId, newRole) {
        try {
            const updatedUser = await this.entity.findByIdAndUpdate(userId, { role: newRole }, { new: true });
            if (!updatedUser) {
                throw new Error(`Usuario con ID ${userId} no encontrado`);
            }
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const deletedUser = await this.entity.findByIdAndDelete(userId);
            if (!deletedUser) {
                throw new Error(`Usuario con ID ${userId} no encontrado`);
            }
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = EntityDAO
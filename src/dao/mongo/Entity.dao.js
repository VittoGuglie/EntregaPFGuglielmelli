const mapEntity = require('./mapEntity.dao')

class EntityDAO {
    constructor(entity) {
        this.entity = mapEntity[entity]
    }
    getAll() {
        try {
            return this.entity.getAll()
        } catch (error) {
            throw error
        }
    }

    getOne() { }

    async create(newUserInfo) {
        try {
            return await this.entity.create(newUserInfo)
        } catch (error) {
            throw error
        }
    }
}

module.exports = EntityDAO;
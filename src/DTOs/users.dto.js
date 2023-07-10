class UserDTO {
    constructor(info) {
        this.first_name = info.first_name;
        this.last_name = info.last_name;
        this.email = info.email;
        this.age = info.age;
        this.password = info.password;
        this.role = info.role || 'User';
    }
}

module.exports = UserDTO;
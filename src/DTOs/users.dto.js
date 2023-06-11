class UserDTO {
    constructor(info) {
        this.name = info.name;
        this.lastname = info.lastname;
        this.fullname = info.name + ' ' + info.lastname;
        this.email = info.email;
        this.phone = info.phone;
        this.role = info.role;
    }
}

module.exports = UserDTO;
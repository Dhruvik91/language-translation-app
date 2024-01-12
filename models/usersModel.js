class Users {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isPasswordReset = { bool: false };
    }
}

module.exports = Users;
class UserDTO {
    constructor(first_name, last_name, email, age, password, role = "user") {
        this.first_name = first_name;
        this.last_name = last_name;
        this.full_name = `${first_name}, ${last_name}` // INFO: Aqui vemos una "bondad" del DTO
        this.email = email;
        this.age = age;
        this.password = password;
        this.role = role;
    }
}

export default UserDTO;

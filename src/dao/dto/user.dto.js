class UserDTO {
    constructor({ first_name, last_name, email, age, password, profile, last_connection, documents, role = "user" } ) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.full_name = `${first_name}, ${last_name}` // INFO: Aqui vemos una "bondad" del DTO
        this.email = email;
        this.age = age;
        this.password = password;
        this.role = role;
        this.profile = profile;
        this.last_connection = last_connection
        this.documents = documents
    }
}

export default UserDTO;

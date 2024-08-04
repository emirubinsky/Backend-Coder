class UserQueryDTO {

    constructor({
        host,
        protocol,
        baseUrl,
        query,
        limit,
        page,
        sort
    }) {

        this.host = host
        this.protocol = protocol
        this.baseUrl = baseUrl
        this.query = query
        this.limit = limit
        this.page = page
        this.sort = sort
    }

}
export default UserQueryDTO;
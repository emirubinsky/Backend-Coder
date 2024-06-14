class TicketQueryDTO {
    constructor({
        host,
        protocol,
        baseUrl,
        query,
        limit,
        page,
        // TODO: esto es mejor para una segunda versión
        /*
        category, 
        brand, 
        sort,
        paginationLimit,
        paginationSize,
        paginationSorting
        */
    }) {

        this.host = host
        this.protocol = protocol
        this.baseUrl = baseUrl
        this.query = query
        this.limit = limit
        this.page = page
    }
}

export default TicketQueryDTO;
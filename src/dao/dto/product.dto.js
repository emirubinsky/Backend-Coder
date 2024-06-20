class ProductDTO {
    constructor({
        title,
        description,
        code,
        category,
        brand,
        price,
        stock,
        status,
        image,
        thumbnails,
        id,
    }) {
        this.title = title
        this.description = description
        this.code = code
        this.category = category
        this.brand = brand
        this.price = price
        this.stock = stock
        this.status = status
        this.image = image // TODO - Prodríamos ponerle MAIN IMAGE, para practicar
        this.thumbnails = thumbnails

        if(id !== -1){
            this.id = id
        }
    }
}

export default ProductDTO;
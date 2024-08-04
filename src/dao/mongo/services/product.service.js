import Product from "../models/product.model.js"

const model = Product

export default class ProductMongoService {
  constructor() {}

  async getOne(id) {
    const product = await model.findOne({ _id: id }).lean();

    return product
  }

  async getAll(productQueryDTO) {

    const {
      host,
      protocol,
      baseUrl,
      query,
      limit,
      page,
      sort
    } = productQueryDTO

    const options = {
      page,
      limit,
      sort
    }

    const productPaginationOutput = await model.paginate(query, options);

    const products = productPaginationOutput.docs.map(product => product.toObject());

    let prevLink = null;
    if (productPaginationOutput.hasPrevPage) {
      prevLink = `${protocol}://${host}${baseUrl}?page=${productPaginationOutput.prevPage}`;
    }

    // Determinar el link para la página siguiente
    let nextLink = null;
    if (productPaginationOutput.hasNextPage) {
      nextLink = `${protocol}://${host}${baseUrl}?page=${productPaginationOutput.nextPage}`;
    }

    return {
      products,
      pagination: {
        totalDocs: productPaginationOutput.totalDocs,
        limit: productPaginationOutput.limit,
        totalPages: productPaginationOutput.totalPages,
        page: productPaginationOutput.page,
        pagingCounter: productPaginationOutput.pagingCounter,
        hasPrevPage: productPaginationOutput.hasPrevPage,
        hasNextPage: productPaginationOutput.hasNextPage,
        prevPage: productPaginationOutput.prevPage,
        nextPage: productPaginationOutput.nextPage,
        prevLink,
        nextLink
      }
    }
  }

  async insert(productDTO) {

    const { title, brand, description, code, price, stock, status, category, image, thumbnails, owner } = productDTO

    const newEntity = new Product({
      title,
      brand,
      description,
      code,
      price,
      stock,
      status,
      category,
      image,
      thumbnails,
      owner
    });

    const newInsertedDoc = await newEntity.save()
    return newInsertedDoc;
  }

  async update(productDTO) {
  
    const filter = {
      _id: productDTO.id
    }

    const updatedDoc = await model.findOneAndUpdate(filter, productDTO, {
      returnOriginal: false
    })

    return updatedDoc;
  }

  async deleteOne(id) {
    const deletedEntity = await model.deleteOne({ _id: id }).lean();

    return deletedEntity
  }
}


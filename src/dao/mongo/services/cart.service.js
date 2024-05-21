import Cart from "../models/cart.model.js";

const model = Cart

export default class CartMongoService {
    constructor() { }

    // TODO - Considerar usar el middleware de "pre" para alterar las salidas de ciertas operaciones.
    // Clase: 16
    // Peligro, hay que definirlo en el modelo, y es GLOBAL a todas las operaciones.
    async getOne(id, populate = false) {

        const result = await model
            .findOne({ _id: id })
            .populate('products.product')
            .lean()
        /* 
        populate ?
            await model
                .findOne({ _id: id })
                .populate('products.product')
                .lean() :
            await model
                .findOne({ _id: id })
                .lean()

        */

        return result
    }

    async getAll({
        host,
        protocol,
        baseUrl,
        query,
        limit,
        page
    }) {
        const options = {
            page,
            limit,
            populate: {
                path: 'products.product', // populate the product field in the products array
                select: "_id title price"
            }
            //sort
        }

        const cartPaginationOutput = await model.paginate(query, options);

        // Access paginated carts with populated 'items'
        // Access paginated carts with populated 'products'
        cartPaginationOutput.docs.forEach((cart) => {
            console.log('-------');
            console.log('Cart ID:', cart._id);
            console.log('User ID:', cart.user);
            console.log('Products:', cart.products);
            cart.products
                .filter(cartProduct => cartProduct.product !== null)
                .forEach((cartProduct) => {
                    console.log('Product ID:', cartProduct.product._id);
                    //console.log('Product Name:', cartProduct.product.name);
                    console.log('Product Title:', cartProduct.product.title);
                    console.log('Quantity:', cartProduct.quantity);
                });
        });
        //

        const carts = cartPaginationOutput.docs.map(cart => cart.toObject());

        let prevLink = null;
        if (cartPaginationOutput.hasPrevPage) {
            prevLink = `${protocol}://${host}${baseUrl}?page=${cartPaginationOutput.prevPage}`;
        }

        // Determinar el link para la página siguiente
        let nextLink = null;
        if (cartPaginationOutput.hasNextPage) {
            nextLink = `${protocol}://${host}${baseUrl}?page=${cartPaginationOutput.nextPage}`;
        }

        return {
            carts,
            pagination: {
                totalDocs: cartPaginationOutput.totalDocs,
                limit: cartPaginationOutput.limit,
                totalPages: cartPaginationOutput.totalPages,
                page: cartPaginationOutput.page,
                pagingCounter: cartPaginationOutput.pagingCounter,
                hasPrevPage: cartPaginationOutput.hasPrevPage,
                hasNextPage: cartPaginationOutput.hasNextPage,
                prevPage: cartPaginationOutput.prevPage,
                nextPage: cartPaginationOutput.nextPage,
                prevLink,
                nextLink
            }
        }
    }

    async insert({ products, user }) {

        const newEntity = new Cart({
            products,
            user
        });

        const existentCart = await model.findOne({ user });
        console.log("MONGO SERVICE > CART | CHECKING EXISTENCE", { existentCart })
        if (existentCart) {
            return existentCart
        }

        // else: create a new one
        const newInsertedDoc = await newEntity.save()
        return newInsertedDoc;

    }

    async update({ id, products, user }) {

        const filter = {
            _id: id
        }

        const entityToUpdate = {
            user,
            products
        }

        console.log("MONGO > cart.service > update", { filter, entityToUpdate })

        const updatedDoc = await model.findOneAndUpdate(filter, entityToUpdate, {
            returnOriginal: false
        })

        return updatedDoc;
    }

    async deleteOne(id) {
        const deletedEntity = await model.deleteOne({ _id: id }).lean();

        return deletedEntity
    }

}

import express from "express"

import { faker } from '@faker-js/faker'

const mockRouter = express.Router();

mockRouter.get('/products/', (req, res) => {
    const mockProducts = [];

    for (let i = 0; i < 5; i++) {
        const product = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.string.uuid(),
            category: faker.commerce.department(),
            brand: faker.company.buzzPhrase(),
            price: parseFloat(faker.commerce.price()),
            stock: faker.number.int({ min: 0, max: 100 }),
            status: faker.datatype.boolean(),
            image: faker.image.url(),
            thumbnails: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.image.url()),
        };

        mockProducts.push(product);
    }

    res.json(mockProducts);
});

export default mockRouter;
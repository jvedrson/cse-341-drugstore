const { getAll, getSingle, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Mock de la base de datos
jest.mock('../db/database', () => ({
    getDatabase: jest.fn()
}));

const mongodb = require('../db/database');

// Helpers para mockear req y res
const mockRes = () => {
    const res = {};
    res.setHeader = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (params = {}, body = {}) => ({ params, body });

// ID válido de MongoDB
const validId = '64b1f21c9f1b2c3d4e5f6789';

// ─────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────
describe('getAll', () => {
    test('200 - retorna lista de productos', async () => {
        const fakeProducts = [{ name: 'Aspirina' }, { name: 'Ibuprofeno' }];

        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                find: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockResolvedValue(fakeProducts)
                })
            })
        });

        const req = mockReq();
        const res = mockRes();

        await getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeProducts);
    });

    test('500 - error en la base de datos', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                find: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockRejectedValue(new Error('DB error'))
                })
            })
        });

        const req = mockReq();
        const res = mockRes();

        await getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});

// ─────────────────────────────────────────────
// GET SINGLE
// ─────────────────────────────────────────────
describe('getSingle', () => {
    test('200 - retorna producto por ID', async () => {
        const fakeProduct = { name: 'Aspirina', price: 5.99 };

        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn().mockResolvedValue(fakeProduct)
            })
        });

        const req = mockReq({ id: validId });
        const res = mockRes();

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeProduct);
    });

    test('404 - producto no encontrado', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn().mockResolvedValue(null)
            })
        });

        const req = mockReq({ id: validId });
        const res = mockRes();

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not found.' });
    });

    test('400 - ID inválido', async () => {
        const req = mockReq({ id: 'id-malo' });
        const res = mockRes();

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid product ID.' });
    });

    test('500 - error en la base de datos', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn().mockRejectedValue(new Error('DB error'))
            })
        });

        const req = mockReq({ id: validId });
        const res = mockRes();

        await getSingle(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});

// ─────────────────────────────────────────────
// CREATE PRODUCT
// ─────────────────────────────────────────────
describe('createProduct', () => {
    const body = {
        name: 'Aspirina',
        description: 'Analgésico',
        price: 5.99,
        stock: 100,
        is_public: true,
        active: true
    };

    test('201 - producto creado correctamente', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({
                    acknowledged: true,
                    insertedId: '123abc'
                })
            })
        });

        const req = mockReq({}, body);
        const res = mockRes();

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product created successfully.',
            id: '123abc'
        });
    });

    test('500 - acknowledged false', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                insertOne: jest.fn().mockResolvedValue({
                    acknowledged: false,
                    error: 'Insert failed'
                })
            })
        });

        const req = mockReq({}, body);
        const res = mockRes();

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Insert failed' });
    });

    test('500 - error en la base de datos', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                insertOne: jest.fn().mockRejectedValue(new Error('DB error'))
            })
        });

        const req = mockReq({}, body);
        const res = mockRes();

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});

// ─────────────────────────────────────────────
// UPDATE PRODUCT
// ─────────────────────────────────────────────
describe('updateProduct', () => {
    const body = {
        name: 'Aspirina Plus',
        description: 'Actualizado',
        price: 7.99,
        stock: 50,
        is_public: false,
        active: true
    };

    test('200 - producto actualizado correctamente', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
            })
        });

        const req = mockReq({ id: validId }, body);
        const res = mockRes();

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product updated successfully.' });
    });

    test('400 - ID inválido', async () => {
        const req = mockReq({ id: 'id-malo' }, body);
        const res = mockRes();

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid product ID.' });
    });

    test('500 - modifiedCount es 0', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                replaceOne: jest.fn().mockResolvedValue({
                    modifiedCount: 0,
                    error: 'Update failed'
                })
            })
        });

        const req = mockReq({ id: validId }, body);
        const res = mockRes();

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
    });

    test('500 - error en la base de datos', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                replaceOne: jest.fn().mockRejectedValue(new Error('DB error'))
            })
        });

        const req = mockReq({ id: validId }, body);
        const res = mockRes();

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});

// ─────────────────────────────────────────────
// DELETE PRODUCT
// ─────────────────────────────────────────────
describe('deleteProduct', () => {
    test('200 - producto eliminado correctamente', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
            })
        });

        const req = mockReq({ id: validId });
        const res = mockRes();

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully.' });
    });

    test('400 - ID inválido', async () => {
        const req = mockReq({ id: 'id-malo' });
        const res = mockRes();

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid product ID.' });
    });

    test('500 - deletedCount es 0', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                deleteOne: jest.fn().mockResolvedValue({
                    deletedCount: 0,
                    error: 'Delete failed'
                })
            })
        });

        const req = mockReq({ id: validId });
        const res = mockRes();

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Delete failed' });
    });

    test('500 - error en la base de datos', async () => {
        mongodb.getDatabase.mockReturnValue({
            collection: jest.fn().mockReturnValue({
                deleteOne: jest.fn().mockRejectedValue(new Error('DB error'))
            })
        });

        const req = mockReq({ id: validId });
        const res = mockRes();

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
});
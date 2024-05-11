
class SessionController {

    /* Estrategia: Local. */

    static async localRegister(req, res) {
        try {
            res.status(201).send({ status: "success", message: "Usuario registrado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error in session controller' });
        }
    }

}
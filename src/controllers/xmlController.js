import ExemploModel from '../models/ExemploModel.js';
import { xmlToObj, sendXml } from '../utils/xmlHelper.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return sendXML(res, 400, { error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, estado, preco } = xmlToObj(req.body);

        if (!nome) return sendXml(res, 400, { error: 'O campo "nome" é obrigatório!' });
        if (preco === undefined || preco === null)
            return sendXml(res, 400, { error: 'O campo "preco" é obrigatório!' });

        const exemplo = new ExemploModel({ nome, estado, preco: parseFloat(preco) });
        const data = await exemplo.criar();

        sendXml(res, 201, { message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        sendXml(res, 500, { error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ExemploModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
             return sendXML(res, 200, { message: 'Nenhum registro encontrado.' });
        }

        sendXml(res, 200, registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        sendXML(res, 500, { error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return sendXML(res, 400, { error: 'O ID enviado não é um número válido.' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
             return sendXML(res, 404, { error: 'Registro não encontrado.' });
        }

        sendXml(res, 200, { data: exemplo });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        sendXML(res, 500, { error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id))  return sendXML(res, 400, { error: 'ID inválido.' });

        if (!req.body) {
            return sendXML(res, 400, { error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return sendXML(res, 404, { error: 'Registro não encontrado para atualizar.' });
        }

        const body = xmlToObj(req.body);

        if (req.body.nome !== undefined) exemplo.nome = req.body.nome;
        if (req.body.estado !== undefined) exemplo.estado = req.body.estado;
        if (req.body.preco !== undefined) exemplo.preco = parseFloat(req.body.preco);

        const data = await exemplo.atualizar();

        sendXml(res, 200, { message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        sendXML(res, 500, { error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return sendXML(res, 400, { error: 'ID inválido.' });

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
             return sendXML(res, 404, { error: 'Registro não encontrado para deletar.' });
        }

        await exemplo.deletar();

        sendXml(res, 200, {
            message: `O registro "${exemplo.nome}" foi deletado com sucesso!`,
            deletado: exemplo,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        sendXML(res, 400, { error: 'Erro ao deletar registro.' });
    }
};

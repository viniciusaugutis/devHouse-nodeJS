import mongoose from 'mongoose';
import * as Yup from 'yup';
import House from '../models/House';
import User from '../models/User';

class HouseController {
  async index(req, res) {
    const { status } = req.query;

    const houses = await House.find({ status });

    return res.json(houses);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const { filename } = req.file;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }

    const house = await House.create({
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    });

    return res.json(house);
  }

  async update(req, res) {
    const { filename } = req.file;
    const { id } = req.params;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: `Object do usuário é inválido` });
    }

    const user = await User.findById(user_id);
    const houseToEdit = await House.findById(id);

    if (!id || !houseToEdit) {
      return res.status(404).json({ error: `Casa não encontrada para edição` });
    }

    if (!user || String(user._id) !== String(houseToEdit.user)) {
      return res
        .status(401)
        .json({ error: `Usuário não enontrado ou autorizado para editar!` });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }

    await House.updateOne(
      { _id: id },
      {
        user: user_id,
        thumbnail: filename,
        description,
        price,
        location,
        status,
      }
    );

    return res.send();
  }

  async destroy(req, res) {
    const { id } = req.body;
    const { user_id } = req.headers;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: `Object do usuário é inválido` });
    }

    const user = await User.findById(user_id);
    const houseToEdit = await House.findById(id);

    if (!id || !houseToEdit) {
      return res
        .status(404)
        .json({ error: `Casa não encontrada para remoção` });
    }

    if (!user || String(user._id) !== String(houseToEdit.user)) {
      return res
        .status(401)
        .json({ error: `Usuário não encontrado ou autorizado para editar!` });
    }

    await House.findByIdAndDelete({ _id: id });

    return res.json({ message: 'Casa removida com sucesso' });
  }
}

export default new HouseController();

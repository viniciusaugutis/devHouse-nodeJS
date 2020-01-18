import Reserve from '../models/Reserve';
// duas formas de importar uma biblioteca ou arquivo JS
import User from '../models/User';

const House = require('../models/House');

class ReserveController {
  async index(req, res) {
    const { user_id } = req.headers;

    const reserves = await Reserve.find({ user: user_id }).populate('house');
    return res.json(reserves);
  }

  async store(req, res) {
    const { user_id } = req.headers;
    const { house_id } = req.params;
    const { date } = req.body;

    const house = await House.findById(house_id);

    if (!house) {
      return res.status(404).json({ error: 'Essa casa não existe!' });
    }

    if (!house.status) {
      return res.status(400).json({ error: 'Casa não disponível!' });
    }

    const user = await User.findById(user_id);

    if (String(user._id) === String(house.user)) {
      return res.status(401).json({ error: 'Reserva não permitida' });
    }

    const reserve = await Reserve.create({
      user: user_id,
      house: house_id,
      date,
    });

    await reserve
      .populate('house')
      .populate('user')
      .execPopulate();

    return res.json(reserve);
  }

  async destroy(req, res) {
    const { id } = req.body;

    await Reserve.findByIdAndDelete(id);

    return res.send();
  }
}

export default new ReserveController();

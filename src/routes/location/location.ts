import axios from 'axios';
import express from 'express';
import { LatLon } from '../../interfaces/latLon.interface';

const router = express.Router();

router.get('/:ip', async (req, res) => {
  const { ip } = req.params;

  if (!ip) {
    return res.sendStatus(500);
  }

  const { data } = await axios.get(`http://ip-api.com/json/${ip}`);

  const latLon: LatLon = {
    lat: data.lat,
    lon: data.lon,
  };

  res.send(latLon);
});

export { router as location };

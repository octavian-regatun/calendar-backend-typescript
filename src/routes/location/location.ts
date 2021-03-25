import axios from 'axios';
import express from 'express';
import config from '../../config';
import { LatLon } from '../../interfaces/latLng.interface';
import { ReverseGeocodeResponse } from '../../interfaces/reverseGeocodeResponse.interface';

const router = express.Router();

router.get('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.sendStatus(500);
  }

  const {
    data: reverseGeocodeResponse,
  } = await axios.get<ReverseGeocodeResponse>(
    `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${config.HERE_API_KEY}&at=${lat},${lon}&lang=en-US`,
  );

  res.send(reverseGeocodeResponse.items[0].address.label);
});

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

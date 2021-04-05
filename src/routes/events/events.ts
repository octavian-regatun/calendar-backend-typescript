import express from 'express';
import { LatLon } from '../../interfaces/latLon.interface';
import { Event, EventModel } from '../../models/event.model';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const event = await EventModel.find({
      $or: [{ participants: req.id }, { author: req.id }],
    });

    res.send(event);
  } catch {
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  interface Body {
    title?: string;
    description?: string;
    fromDate?: string;
    toDate?: string;
    location?: string;
    latLon?: { lat: string; lon: string };
    participants?: string[];
  }

  const event: Body = req.body;

  const newEvent = new EventModel();

  newEvent.title = event.title as string;
  newEvent.description = event.description;
  newEvent.fromDate = new Date(event.fromDate as string);
  newEvent.toDate = event.toDate ? new Date(event.toDate) : undefined;
  newEvent.location = event.location as string;
  newEvent.latLon = event.latLon
    ? {
        lat: parseFloat(event.latLon.lat),
        lon: parseFloat(event.latLon.lon),
      }
    : undefined;
  newEvent.author = req.id as string;
  newEvent.participants = [req.id as string];

  try {
    await newEvent.save();

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);

    return res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await EventModel.findByIdAndDelete(id);

    const event = await EventModel.find({
      $or: [{ participants: req.id }, { author: req.id }],
    });

    res.send(event);
  } catch {
    res.sendStatus(500);
  }
});

export { router as events };

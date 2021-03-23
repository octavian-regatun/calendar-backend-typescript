import express from 'express';
import { Event, EventModel } from '../../models/event.model';
import { RequestBody } from '../../types/requestBody';

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
  try {
    const event: RequestBody<Event> = req.body;

    const newEvent = new EventModel();

    newEvent.title = event.title;
    newEvent.description = event.description;
    newEvent.fromDate = new Date(event.fromDate);
    newEvent.toDate = event.toDate ? new Date(event.toDate) : undefined;
    newEvent.location = event.location;
    newEvent.author = req.id as string;
    newEvent.participants = [req.id as string];

    await newEvent.save();

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
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

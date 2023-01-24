import { Subscriber } from 'data';
import { newSubscriber } from 'data/server';
import { NextApiHandler } from 'next';

export type SubscribeRouteResponse = {
  subscriber?: {
    email: string;
    subscribed_date: string;
  };
};

type SubscribeRouteBody = {
  email: string;
};

const validateSubscribeRouteBody = (body: {}): body is SubscribeRouteBody =>
  typeof body === 'object' && typeof (body as any)?.email === 'string';

const subscribeRoute: NextApiHandler<SubscribeRouteResponse> = async (
  req,
  res,
) => {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const bodyJson = req.body ?? {};
  if (!validateSubscribeRouteBody(bodyJson)) {
    return res.status(400).json({});
  }

  try {
    const subscriber = await newSubscriber(bodyJson.email);
    return res.status(201).json({
      subscriber: {
        email: subscriber?.email,
        subscribed_date: String(subscriber.subscribed_date),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({});
  }
};

export default subscribeRoute;

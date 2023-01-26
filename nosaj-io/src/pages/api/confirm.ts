import { confirmSubscriber, newSubscriber } from 'data/server';
import { NextApiHandler } from 'next';

export type ConfirmRouteResponse = {
  confirmed?: boolean;
  error?: {
    type: 'invalid_body' | 'internal';
  };
};

type ConfirmRouteBody = {
  email: string;
  token: string;
};

const validateConfirmRouteBody = (body: {}): body is ConfirmRouteBody =>
  typeof body === 'object' && typeof (body as any)?.token === 'string';

const confirmRoute: NextApiHandler<ConfirmRouteResponse> = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const bodyJson = req.body ?? {};
  if (!validateConfirmRouteBody(bodyJson)) {
    return res.status(400).json({
      error: {
        type: 'invalid_body',
      },
    });
  }

  try {
    const subscriber = await confirmSubscriber(bodyJson.token);
    if (subscriber.confirmed_email) {
      return res.json({ confirmed: true });
    }
    return res.json({ confirmed: false });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      error: { type: 'internal' },
    });
  }
};

export default confirmRoute;

import { newSubscriber } from 'data/server';
import { NextApiHandler } from 'next';
import { sendConfirmEmail } from 'utils/emails';

export type SubscribeRouteResponse = {
  subscriber?: {
    email: string;
    sentConfirmation: boolean;
  };
  error?: {
    type:
      | 'invalid_body'
      | 'email_not_saved'
      | 'existing_subscriber'
      | 'internal';
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
    return res.status(400).json({
      error: {
        type: 'invalid_body',
      },
    });
  }

  try {
    const subscriber = await newSubscriber(bodyJson.email);
    if (!subscriber?.email) {
      return res.status(400).json({
        error: {
          type: 'email_not_saved',
        },
      });
    }
    const confirmEmail = await sendConfirmEmail(subscriber.email);
    return res.status(201).json({
      subscriber: {
        email: subscriber.email,
        sentConfirmation: confirmEmail,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    if ((err as Error)?.message?.startsWith('duplicate key')) {
      return res.status(400).json({
        error: { type: 'existing_subscriber' },
      });
    }
    return res.status(500).json({
      error: { type: 'internal' },
    });
  }
};

export default subscribeRoute;

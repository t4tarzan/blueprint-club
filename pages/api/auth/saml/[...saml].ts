import { NextApiRequest, NextApiResponse } from 'next';
import { getJacksonOption } from '../../../../lib/boxyhq/config';
import { Jackson } from '@boxyhq/saml-jackson';

// Initialize SAML Jackson
const jacksonPromise = Jackson.init(getJacksonOption());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const [action] = query.saml as string[];

  try {
    const jackson = await jacksonPromise;

    switch (action) {
      case 'metadata':
        // Handle SAML metadata endpoint
        if (method === 'GET') {
          const { tenant, product } = req.query;
          if (!tenant || !product) {
            return res.status(400).json({ error: 'Missing tenant or product' });
          }

          const metadata = await jackson.metadata({
            tenant: tenant as string,
            product: product as string,
          });

          res.setHeader('Content-Type', 'text/xml');
          return res.send(metadata);
        }
        break;

      case 'callback':
        // Handle SAML callback (ACS endpoint)
        if (method === 'POST') {
          const { SAMLResponse, RelayState } = req.body;
          
          const { profile } = await jackson.validateSamlResponse({
            samlResponse: SAMLResponse,
            relayState: RelayState,
          });

          // Store the user profile in session or handle as needed
          return res.redirect(302, `/api/auth/callback/boxyhq-saml?profile=${encodeURIComponent(JSON.stringify(profile))}`);
        }
        break;

      case 'config':
        // Handle SAML configuration
        if (method === 'POST') {
          const { tenant, product, configuration } = req.body;

          if (!tenant || !product || !configuration) {
            return res.status(400).json({ error: 'Missing required parameters' });
          }

          await jackson.createSamlConnection({
            tenant,
            product,
            ...configuration,
          });

          return res.json({ success: true });
        }
        
        if (method === 'GET') {
          const { tenant, product } = req.query;
          
          if (!tenant || !product) {
            return res.status(400).json({ error: 'Missing tenant or product' });
          }

          const config = await jackson.getSamlConnection({
            tenant: tenant as string,
            product: product as string,
          });

          return res.json(config);
        }
        break;

      default:
        res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('SAML error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

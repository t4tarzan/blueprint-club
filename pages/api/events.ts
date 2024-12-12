import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/notion';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const eventsDatabase = process.env.NOTION_EVENTS_DATABASE_ID;
    if (!eventsDatabase) {
      throw new Error('Missing NOTION_EVENTS_DATABASE_ID environment variable');
    }

    const events = await getDatabase(eventsDatabase);
    
    // Transform the Notion data into a cleaner format
    const transformedEvents = events.map((event: any) => ({
      id: event.id,
      title: event.properties.Name?.title[0]?.plain_text || '',
      date: event.properties.Date?.date?.start || '',
      description: event.properties.Description?.rich_text[0]?.plain_text || '',
      status: event.properties.Status?.select?.name || '',
      location: event.properties.Location?.rich_text[0]?.plain_text || '',
    }));

    return res.status(200).json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Error fetching events' });
  }
}

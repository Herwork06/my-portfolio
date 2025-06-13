export const runtime = 'edge';
import { headers } from "next/headers";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
        const headersList = await headers()
        const city = headersList.get("cf-city")
        const country = headersList.get("cf-ipcountry");
        const lat = headersList.get("cf-latitude");
        const long = headersList.get("cf-longitude");
        console.log({ city, country, lat, long })
        res.status(200).json({ city, country, lat, long });
    } catch(err) {
        res.status(500).json({ error: {
            message: 'failed to retrive data',
            errorMessage: err
        }})
    }


}

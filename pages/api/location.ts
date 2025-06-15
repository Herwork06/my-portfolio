import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const city = "Bodø"
    const country = "NO";
    const lat = "38.865474";
    const long = "-94.666161";
    console.log({ city, country, lat, long })
    res.status(200).json({ city, country, lat, long });
}

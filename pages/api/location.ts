/* eslint-disable @typescript-eslint/no-explicit-any */
export default function handler(req: { headers: { [x: string]: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { city: any; country: any; lat: any; lon: any; }): void; new(): any; }; }; }) {
  const city = req.headers["cf-city"];
  const country = req.headers["cf-ipcountry"];
  const lat = req.headers["cf-latitude"];
  const lon = req.headers["cf-longitude"];
  console.log({ city, country, lat, lon })
  res.status(200).json({ city, country, lat, lon });
}

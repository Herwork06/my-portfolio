export const runtime = 'edge';
import { headers } from "next/headers";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: { headers: { [x: string]: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { city: any; country: any; lat: any; lon: any; }): void; new(): any; }; }; }) {

    const headersList = await headers()
    const city = headersList.get("cf-city")
    const country = headersList.get("cf-ipcountry");
    const lat = headersList.get("cf-latitude");
    const lon = headersList.get("cf-longitude");
    console.log({ city, country, lat, lon })
    res.status(200).json({ city, country, lat, lon });

}

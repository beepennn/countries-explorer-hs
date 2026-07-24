import countries from "@/data/countries.json";

export const revalidate = 60 * 60 * 24 * 30; // 30 days

export async function GET() {
  const formatted = countries.map((country: any) => ({
    name: {
      common: country.name.common,
      official: country.name.official,
    },
    cca3: country.cca3,

    region: country.region,

    subregion: country.subregion ?? "",

    capital: country.capital ?? [],

    population: country.population ?? 0,

    area: country.area ?? 0,

    languages: country.languages ?? {},

    currencies: country.currencies ?? {},

    flags: {
      png: country.flags?.png,
      svg: country.flags?.svg,
      alt: country.flags?.alt,
    },
  }));

  return Response.json(formatted);
}
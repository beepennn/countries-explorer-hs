export interface Country {
  name: {
    common: string
    official: string
    nativeName?: {
      [key: string]: {
        official: string
        common: string
      }
    }
  }
  cca3: string
  capital?: string[]
  region: string
  subregion?: string
  languages?: {
    [key: string]: string
  }
  population: number
  area: number
  flags: {
    png: string
    svg: string
    alt?: string
  }
  currencies?: {
    [key: string]: {
      name: string
      symbol: string
    }
  }
  maps?: {
    googleMaps: string
    openStreetMaps: string
  }
}
export type Country = {
  name: { common: string; official: string };
  capital?: string[];
  population: number;
  area: number;
  languages?: { [key: string]: string };
  currencies?: {
    [currencyCode: string]: { name: string; symbol: string };
  };
  flags: {
    svg: string;
    png: string;
    alt?: string;
  };
};

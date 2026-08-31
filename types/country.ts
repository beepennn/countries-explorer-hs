export interface Country {
  name: {
    common: string
    official: string
  }

  cca3: string

  region: string
  subregion?: string

  capital?: string[]

  population: number
  area: number

  languages?: Record<string, string>

  currencies?: Record<
    string,
    {
      name: string
      symbol: string
    }
  >

  flags: {
    png: string
    svg: string
    alt?: string
  }
}
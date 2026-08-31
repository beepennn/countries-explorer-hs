import { NextResponse } from "next/server"

const API_URL = "https://api.restcountries.com/countries/v5"

const RESPONSE_FIELDS = [
  "names.common",
  "names.official",
  "codes.alpha_3",
  "region",
  "subregion",
  "capitals",
  "population",
  "area.kilometers",
  "languages",
  "currencies",
  "flag.url_png",
  "flag.url_svg",
  "flag.description",
].join(",")

type RestCountry = {
  names?: {
    common?: string
    official?: string
  }

  codes?: {
    alpha_3?: string
  }

  region?: string
  subregion?: string

  capitals?: Array<
    | string
    | {
        name?: string
      }
  >

  population?: number

  area?:
    | number
    | {
        kilometers?: number
      }

  languages?:
    | Array<{
        name?: string
        native_name?: string
        iso_639_3?: string
        iso639_3?: string
        code?: string
        bcp47?: string
      }>
    | Record<string, string>

  currencies?:
    | Record<
        string,
        | string
        | {
            name?: string
            symbol?: string
          }
      >
    | Array<{
        code?: string
        name?: string
        symbol?: string
      }>

  flag?: {
    url_png?: string
    url_svg?: string
    description?: string
  }
}

type ApiResponse = {
  data?: {
    objects?: RestCountry[]

    meta?: {
      total?: number
      count?: number
      limit?: number
      offset?: number
      more?: boolean
    }
  }

  errors?: Array<{
    message?: string
  }>
}

function normalizeCapitals(
  capitals: RestCountry["capitals"],
): string[] {
  if (!Array.isArray(capitals)) {
    return []
  }

  return capitals
    .map((capital) => {
      if (typeof capital === "string") {
        return capital
      }

      return capital?.name
    })
    .filter((capital): capital is string => Boolean(capital))
}

function normalizeLanguages(
  languages: RestCountry["languages"],
): Record<string, string> {
  if (!languages) {
    return {}
  }

  if (Array.isArray(languages)) {
    return Object.fromEntries(
      languages.map((language, index) => {
        const code =
          language.iso_639_3 ||
          language.iso639_3 ||
          language.code ||
          language.bcp47 ||
          `lang-${index}`

        const name =
          language.name ||
          language.native_name ||
          "Unknown"

        return [code, name]
      }),
    )
  }

  return languages
}

function normalizeCurrencies(
  currencies: RestCountry["currencies"],
): Record<
  string,
  {
    name: string
    symbol: string
  }
> {
  if (!currencies) {
    return {}
  }

  if (Array.isArray(currencies)) {
    return Object.fromEntries(
      currencies
        .filter((currency) => Boolean(currency.code))
        .map((currency) => [
          currency.code!,
          {
            name: currency.name || currency.code!,
            symbol: currency.symbol || "",
          },
        ]),
    )
  }

  return Object.fromEntries(
    Object.entries(currencies).map(([code, currency]) => {
      if (typeof currency === "string") {
        return [
          code,
          {
            name: currency,
            symbol: "",
          },
        ]
      }

      return [
        code,
        {
          name: currency?.name || code,
          symbol: currency?.symbol || "",
        },
      ]
    }),
  )
}

function normalizeCountry(country: RestCountry) {
  const commonName = country.names?.common || "Unknown"

  const officialName =
    country.names?.official || commonName

  let area = 0

  if (typeof country.area === "number") {
    area = country.area
  } else if (
    country.area &&
    typeof country.area.kilometers === "number"
  ) {
    area = country.area.kilometers
  }

  return {
    name: {
      common: commonName,
      official: officialName,
    },

    cca3: country.codes?.alpha_3 || "",

    region: country.region || "",

    subregion: country.subregion || "",

    capital: normalizeCapitals(country.capitals),

    population:
      typeof country.population === "number"
        ? country.population
        : 0,

    area,

    languages: normalizeLanguages(country.languages),

    currencies: normalizeCurrencies(country.currencies),

    flags: {
      png: country.flag?.url_png || "",
      svg: country.flag?.url_svg || "",
      alt:
        country.flag?.description ||
        `Flag of ${commonName}`,
    },
  }
}

async function fetchPage(
  apiKey: string,
  offset: number,
): Promise<ApiResponse> {
  const url = new URL(API_URL)

  url.searchParams.set("limit", "100")
  url.searchParams.set("offset", String(offset))
  url.searchParams.set(
    "response_fields",
    RESPONSE_FIELDS,
  )

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },

    next: {
      revalidate: 60 * 60 * 24,
    },
  })

  const result: ApiResponse = await response.json()

  if (!response.ok) {
    const message =
      result.errors?.[0]?.message ||
      `REST Countries API returned ${response.status}`

    throw new Error(message)
  }

  return result
}

export async function GET() {
  try {
    const apiKey =
      process.env.RESTCOUNTRIES_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "RESTCOUNTRIES_API_KEY is not configured",
        },
        {
          status: 500,
        },
      )
    }

    const allCountries: RestCountry[] = []

    let offset = 0
    let hasMore = true

    while (hasMore) {
      const result = await fetchPage(
        apiKey,
        offset,
      )

      const pageCountries =
        result.data?.objects || []

      if (pageCountries.length === 0) {
        break
      }

      allCountries.push(...pageCountries)

      hasMore =
        result.data?.meta?.more === true

      offset += pageCountries.length
    }

    const countries = allCountries
      .map(normalizeCountry)
      .filter(
        (country) =>
          country.cca3 &&
          country.name.common !== "Unknown",
      )
      .sort((a, b) =>
        a.name.common.localeCompare(
          b.name.common,
        ),
      )

    return NextResponse.json(countries, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch (error) {
    console.error(
      "Countries API error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch countries",
      },
      {
        status: 500,
      },
    )
  }
}
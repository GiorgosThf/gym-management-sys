import { useApi } from '../utils/api.ts'
import { Cities, Country } from '../types'

export const LocationService = () => {
    const api = useApi()

    return {
        getCountries: async (): Promise<Country[]> => {
            return api
                .get('https://countriesnow.space/api/v0.1/countries/info?returns=name,iso2', false)
                .then(async (response: Response) => {
                    return await response.json().then((data) => {
                        return data.data
                    })
                })
        },

        getCities: async (countryName: string): Promise<string[]> => {
            const country = countryName === 'USA' ? 'united states' : countryName
            return api
                .post(
                    `https://countriesnow.space/api/v0.1/countries/cities`,
                    { country: country },
                    false
                )
                .then(async (response: Response) => {
                    return await response.json().then((data: Cities) => {
                        return data.data
                    })
                })
        },
    }
}

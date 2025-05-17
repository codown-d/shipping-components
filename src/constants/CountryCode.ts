export enum CountryCode {
    USA = 'USA',
    CHN = 'CHN',
    HKG = 'HKG',
}

export const BrowserLanMapCountry: Record<string, string> = {
    'es-us': CountryCode.USA,
    'en-us': CountryCode.USA,
    'zh-cn': CountryCode.CHN,
    zh: CountryCode.CHN,
    'zh-hk': CountryCode.HKG,
};

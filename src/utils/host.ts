const getPostmenApi = () => {
    const env = process.env.APP_ENV;

    switch (env) {
        case 'development':
        case 'testing':
        case 'testing-incy':
        case 'release-tidy':
        case 'release-incy':
            return 'https://release-incy-api.postmen.io';
        case 'release-core':
            return 'https://release-core-api.postmen.io';
        case 'release-pear':
        case 'release-kiwi':
            return 'https://release-kiwi-api.postmen.io';
        case 'release-nike':
            return 'https://release-nike-api.postmen.io';

        default:
            return 'https://api.postmen.com';
    }
};

const HOSTS = (() => {
    return {
        postmenAPI: getPostmenApi(),
    };
})();

export default HOSTS;

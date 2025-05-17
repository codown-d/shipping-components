const getIsTestMode = () => {
    return localStorage.getItem('postmenSandboxEnabled');
};

export default getIsTestMode();

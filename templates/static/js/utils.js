import constants from "./constants";

const getImagePathForRole = (role) => {
    const roleKey = role.toLowerCase().replace(/['\s]+/g, '');
    return '../../../public/images/' +  constants.ROLE_METADATA[roleKey]['imageFilePath'];
};

const getDescriptionForRole = (role) => {
    const roleKey = role.toLowerCase().replace(/['\s]+/g, '');
    return constants.ROLE_METADATA[roleKey]['description'];
};

export default {
    getImagePathForRole,
    getDescriptionForRole
};
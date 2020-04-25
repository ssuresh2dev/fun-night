import constants from "./constants";
import React from "react";

const getImagePathForRole = (role) => {
    const roleKey = getDisplayNameForRole(role).toLowerCase().replace(/['\s]+/g, '');
    return '../../../public/images/' +  constants.ROLE_METADATA[roleKey]['imageFilePath'];
};

const getDescriptionForRole = (role) => {
    const roleKey = role.toLowerCase().replace(/['\s]+/g, '');
    return constants.ROLE_METADATA[roleKey]['description'];
};

const getDisplayNameForRole = (role) => {
    if (role.includes('->')) {
        return role.split(' -> ')[0];
    } else {
        return role;
    }
};

const getPlayerOriginalRole = (player, roleData) => {
    const originalRoleMapping = roleData['originalRoleMapping'];
    for (const role in originalRoleMapping) {
        const val = originalRoleMapping[role];
        if (typeof val === 'string' || val instanceof String) {
            if (val === player) {
                return role;
            }
        } else {
            if (val.indexOf(player) > -1) {
                return role;
            }
        }
    }
};

const getPlayerFinalRole = (player, roleData) => {
    const role = roleData['currentAssignments'][player];
    if (role.includes('->')) {
        return role.split(' -> ').slice(-1)[0];
    } else {
        return role;
    }
};

const getRationalistDeformattedRole = (role) => {
    if (role.includes('Rationalist')) {
        return role.split(' - ')[0];
    } else {
        return role
    }
};

const getNeighbors = (player, roleData) => {
    const ordering = roleData['ordering'];
    const pIndex = ordering.indexOf(player);
    if (pIndex === ordering.length - 1) {
        return [ordering[0], ordering[ordering.length - 2]];
    } else if (pIndex === 0) {
        return [ordering[1], ordering[ordering.length - 1]];
    } else {
        return [ordering[pIndex - 1], ordering[pIndex + 1]];
    }
};

export default {
    getImagePathForRole,
    getDescriptionForRole,
    getDisplayNameForRole,
    getPlayerOriginalRole,
    getPlayerFinalRole,
    getNeighbors,
    getRationalistDeformattedRole
};
import axios from 'axios';

const getAllRoles = () => {
  return axios
      .get('/api/get_all_roles')
      .then((response) => response.data)
};

export default {
  getAllRoles
};

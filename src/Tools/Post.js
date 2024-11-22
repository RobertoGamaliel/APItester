import { backendApi } from "./APIs";
import { getUser, removeUser } from "./BD";

/**
 * 
 * @param {string} url endpoint to call
 * @param {Object} args arguments to send
 * @param {loader} loader if the function should show a loader when the data is loading
 * @returns 
 */
export const Post = async (url, args, loader = null) => {


   var user = getUser();
   if (user) args.token = user.token;
   if (loader) loader(true);
   try {
      let resp = await backendApi.post(url, args);
      if (loader) loader(false);
      if (!resp.data) return { 'estatus': false, msj: 'Error de conexión, por favor intentelo más tarde' };
      if (!resp.data.estatus && resp.data.msj && resp.data.msj.toLowerCase() === 'no autorizado') {
         removeUser();
         //localStorage.clear();
      }
      return resp.data;
   } catch (error) {
      if (loader) loader(false);
      if (error.response && error.response.data && typeof error.response.data.msj === 'string' && error.response.data.msj.toLowerCase() === 'no autorizado') {
         removeUser();
         return error.response.data;
      }

      return { 'estatus': false, msj: 'Ocurrió un error: ' + error };
   }
}

export default Post;
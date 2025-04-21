import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const translateRussianToGagauz = async (text) => {
  const url = `${API_URL}/api/translate`;

  try {
    let response = await axios.post(url, { text });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

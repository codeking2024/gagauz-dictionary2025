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

export const getHistoryByLink = async (code) => {
  const url = `${API_URL}/api/link/${code}`;

  try {
    let response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addSuggestionText = async (data) => {
  const url = `${API_URL}/api/suggest`;
  try {
    let response = await axios.post(url, data);
    console.log(response, "response");
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

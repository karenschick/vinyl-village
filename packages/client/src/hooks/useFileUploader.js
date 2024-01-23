import api from "../util/api";

const useFileUploader = () => {
  const uploadFile = async (url, file, name) => {
    const formData = new FormData();
    formData.append(name, file);
    console.log(formData);
    return await api.post(url, formData);
  };
  return {
    uploadFile,
  };
};

export default useFileUploader;

const axios = require("axios");

const api = axios.create({
  baseURL: "https://demeter-main-dot-sayakaya.et.r.appspot.com/api",
  headers: { Authorization: "Bearer " + process.env.STRAPI_TOKEN },
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getThumbnailImage = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const blob = new Blob([response.data], { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("files", blob);

    const res = await api.post("/upload", formData);

    console.log(`migrate image for id: ${res.data[0].id}}`);

    return res.data[0].id;
  } catch (error) {
    console.error(`error migrating image for url: ${url}`);
  }
};

const categoryMigrator = async (categories) => {
  for (const category of categories) {
    await api.post("/categories", { data: category });
    console.log(`migrating ${category.name}`);
    await sleep(1000);
  }
};

const postMigrator = async (post) => {
  await api.post("/posts", { data: post });
  console.log(`migrating ${post.title}`);
};

const tagMigrator = async (tags) => {
  for (const tag of tags) {
    await api.post("/tags", { data: tag });
    console.log(`migrating ${tag.name}`);
    await sleep(1000);
  }
};

module.exports = {
  tagMigrator,
  getThumbnailImage,
  sleep,
  postMigrator,
  categoryMigrator,
};

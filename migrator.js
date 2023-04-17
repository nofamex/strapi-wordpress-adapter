const axios = require("axios");
const request = require("request");

const HESTIA_URL = "https://web-hestia-b5h7fuyqbq-as.a.run.app/wp-json/wp/v2/";

const api = axios.create({
  baseURL: "https://demeter-staging-dot-sayakaya.et.r.appspot.com/api",
  headers: { Authorization: "Bearer " + process.env.STRAPI_TOKEN },
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const postMigrator = async (gs_url, post) => {
  request({ url: gs_url, encoding: null }, async (error, response, body) => {
    const blob = new Blob([body], { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("files", blob);

    const res = await api.post("/upload", formData);

    const postRes = { ...post, thumbnail: res.data[0].id };

    await api.post("/posts", { data: postRes });
    console.log(`migrating ${postRes.title}`);
  });
};

const tagMigrator = async (tags) => {
  tags.forEach(async (tag) => {
    await api.post("/tags", { data: tag });
    console.log(`migrating ${tag.name}`);
  });
};

const categoryMigrator = async (categories) => {
  categories.forEach(async (category) => {
    await api.post("/categories", { data: category });
    console.log(`migrating ${category.name}`);
  });
};

module.exports = { postMigrator, tagMigrator, categoryMigrator, sleep };

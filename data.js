const axios = require("axios");
const TurndownService = require("turndown");
const {
  postMigrator,
  tagMigrator,
  categoryMigrator,
  sleep,
} = require("./migrator");

const HESTIA_URL = "https://web-hestia-b5h7fuyqbq-as.a.run.app/wp-json/wp/v2/";
const turndownService = new TurndownService();

const getTagsData = async () => {
  const tagRes = await axios.get(HESTIA_URL + "tags?per_page=100");
  const parsedTags = tagRes.data.map((tag) => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      slug: tag.slug,
    };
  });
  tagMigrator(parsedTags);
};

const getCategoriesData = async () => {
  const catRes = await axios.get(HESTIA_URL + "categories?per_page=100");
  const parsedCat = catRes.data.map((tag) => {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      slug: tag.slug,
    };
  });
  categoryMigrator(parsedCat);
};

const getPostsData = async () => {
  const postRes = await axios.get(HESTIA_URL + "posts?_embed&per_page=100");
  postRes.data.forEach(async (tag) => {
    const post = {
      id: tag.id,
      title: turndownService.turndown(tag.title.rendered),
      author: {
        connect: [1],
      },
      categories: {
        connect: tag.categories,
      },
      tags: {
        connect: tag.tags,
      },
      content: turndownService.turndown(tag.content.rendered.replace(/-/g, "")),
      meta_title: tag.title.rendered,
      meta_keyword: "",
      meta_description: "",
      status: tag.status,
    };
    await postMigrator(tag._embedded["wp:featuredmedia"][0].source_url, post);
  });
};

module.exports = { getTagsData, getCategoriesData, getPostsData };

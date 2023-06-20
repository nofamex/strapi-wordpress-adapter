const axios = require("axios");
const TurndownService = require("turndown");
const {
  tagMigrator,
  getThumbnailImage,
  sleep,
  postMigrator,
  categoryMigrator,
} = require("./migrator");
const slug = require("slug")

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
  for (const post of postRes.data) {
    const postMapped = {
      id: post.id,
      title: turndownService.turndown(post.title.rendered),
      author: {
        connect: [1],
      },
      categories: {
        connect: post.categories,
      },
      tags: {
        connect: post.tags,
      },
      content: turndownService.turndown(
        post.content.rendered.replace(/-/g, "")
      ),
      meta_title: post.title.rendered,
      meta_keyword: "",
      meta_description: "",
      status: post.status,
      thumbnail: await getThumbnailImage(
        post._embedded["wp:featuredmedia"][0].source_url
      ),
      slug: slug(post.slug)
    };
    await postMigrator(postMapped);
    await sleep(1500);
  }
};

module.exports = { getTagsData, getCategoriesData, getPostsData };

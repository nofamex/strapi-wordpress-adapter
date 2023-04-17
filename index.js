require("dotenv").config();

const { getTagsData, getCategoriesData, getPostsData } = require("./data");

(async () => {
  await getPostsData();
  //   await getTagsData();
  //   await getCategoriesData();
})();

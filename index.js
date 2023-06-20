require("dotenv").config();

const { getTagsData, getCategoriesData, getPostsData } = require("./data");
const { updatePostDate } = require("./editor")

updatePostDate()
// getTagsData();
// getCategoriesData();
// getPostsData();

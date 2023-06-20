const axios = require("axios")

const updatePostDate = async () => {
  const pg = require("knex")({
    client: "pg",
    connection: process.env.DB_URL,
    searchPath: ["knex", "public"]
  })
  
  // pg("posts").select("created_at", "updated_at", "published_at")
  //   .then((post) => {console.log(post)})
  //
  
  const HESTIA_URL = "https://web-hestia-b5h7fuyqbq-as.a.run.app/wp-json/wp/v2/"; 

  const postRes = await axios.get(HESTIA_URL + "posts?_embed&per_page=100");

  for (const post of postRes.data) {
    const date = new Date(post.date)
    pg("posts")
      .where("id", "=", post.id)
      .update({
        created_at: date,
        updated_at: date,
        published_at: date,
      }).then(() => {
        console.log(`updated post for id ${post.id}`)
      })

    // pg("posts").select("created_at").where("id", "=", post.id).then((post) => {console.log(post)})
  }
  console.log("finish updating date")
}

module.exports = {updatePostDate}

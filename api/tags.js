const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next(); // THIS IS DIFFERENT
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params;
    try {
        // use our method to get posts by tag name from the db
        const postByTagName = await getPostsByTagName(tagName);
        const posts = postByTagName.filter(post => {
            if (post.active) {
                return true;
            }
            if (req.user && post.author.id === req.user.id) {
                return true;
            }
            return false;
        })
        // send out an object to the client { posts: // the posts }
        res.send({ posts: postByTagName })
    } catch ({ name, message }) {
        // forward the name and message to the error handler
        next({ name, message });
    }
});


module.exports = tagsRouter;
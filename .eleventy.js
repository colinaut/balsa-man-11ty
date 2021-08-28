const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const blogTools = require("eleventy-plugin-blog-tools");
const markdownIt = require('markdown-it')
const markdownItAttrs = require('markdown-it-attrs')

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  /* -------------------------------------------------------------------------- */
  /*                                 Markdown It                                */
  /* -------------------------------------------------------------------------- */

  // Used to add classes to markdown elements

  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  }

  const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs)

  eleventyConfig.setLibrary('md', markdownLib)

  /* -------------------------------------------------------------------------- */
  /*                                   Plugins                                  */
  /* -------------------------------------------------------------------------- */

  // Blog Tools Plugin
  eleventyConfig.addPlugin(blogTools);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Filters                                  */
  /* -------------------------------------------------------------------------- */

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addFilter('sortCollection', function(collection) {
    if (collection) return collection.sort((a,b) => {
        const aOrder = a.data.order || 0;
        const bOrder = b.data.order || 0;
        return aOrder - bOrder || aTitle.localeCompare(bTitle);
    });
    return false;
  });

  eleventyConfig.addFilter('collectionByYear', function(collection) {
    /* --------------------- Get array of unique post years --------------------- */
    const yearsArray = collection.map(p => p.date.getFullYear()).filter((val, ind, arr) => arr.indexOf(val) === ind);
    console.log("🚀 ~ file: .eleventy.js ~ line 67 ~ eleventyConfig.addFilter ~ yearsArray", yearsArray)
    let postsByYear = []
    yearsArray.forEach(year => {
      const postYear = collection.filter(p => p.date.getFullYear() === year)
      if (postYear) postsByYear = [...postsByYear,{ year: year, collection: postYear }]
    })
    return postsByYear
  })

  /* -------------------------------------------------------------------------- */
  /*                                 Shortcodes                                 */
  /* -------------------------------------------------------------------------- */

  eleventyConfig.addShortcode("gallery", function (photos) {
    let gallery = '<div class="gallery-list">'
    photos.forEach(photo => {
      gallery = gallery + `<div class="gallery-item"><a href="${photo.link}"><div class="gallery-photo"><img src='${photo.url_m}' alt=''/></div><h4 class="gallery-photo-title">${photo.title}</h4></a></div>`
    })
    gallery = gallery + '</div>'
    return gallery
  });

  /* -------------------------------------------------------------------------- */
  /*                                 Build Stuff                                */
  /* -------------------------------------------------------------------------- */

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/static/uploads");
  eleventyConfig.addPassthroughCopy("./src/static/js");
  eleventyConfig.addPassthroughCopy("./src/images");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/favicon.svg");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
